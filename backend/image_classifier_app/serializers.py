from rest_framework import serializers

# Define a serializer class for uploading images
class ImageUploadSerializer(serializers.Serializer):
    # This field handles image uploads
    image = serializers.ImageField()