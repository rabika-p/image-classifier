from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ImageUploadSerializer

# Import necessary libraries for image processing and prediction
from efficientnet.tfkeras import EfficientNetB0
import numpy as np
from PIL import Image
import io
from tensorflow.keras.applications.imagenet_utils import decode_predictions


# Define a view for uploading images and predicting their classes
class ImageUploadView(APIView):
    def post(self, request):
        # Instantiate the serializer with the data from the request
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            # Extract the image data from the serializer
            image = serializer.validated_data["image"]

            # Open the image file, resize it to the required dimensions, and convert it to an array
            img = Image.open(io.BytesIO(image.read())).resize((224, 224))
            img_array = np.expand_dims(np.array(img), axis=0) / 255.0

            # Load pre-trained EfficientNet Model
            model = EfficientNetB0(weights="imagenet")

            # Predict image class
            predictions = model.predict(img_array)
            decoded_predictions = decode_predictions(predictions)

            # Extract top predicted class and its associated probability
            top_prediction = decoded_predictions[0][0]
            class_label = top_prediction[1]
            class_probability = top_prediction[2]

            # Return the predicted class label and probability in the response
            return Response(
                {"class_label": class_label, "class_probability": class_probability},
                status=status.HTTP_200_OK,
            )

        else:
            # If the provided data is not valid, return the validation errors in the response
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
