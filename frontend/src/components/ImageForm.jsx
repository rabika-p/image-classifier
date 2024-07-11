import { useState } from "react";
import axios from "axios";

const ImageForm = () => {
  const [image, setImage] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // key-value pair of form field and data
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload/",
        formData,
        {
          // To send files through the req
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { class_label, class_probability } = response.data;
      setClassificationResult({ class_label, class_probability });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    // Get the selected file from the input field
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
      };
      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md p-6 bg-gray-100 rounded-md shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Upload your image here!
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="image"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select Image
            </label>
            <div className="relative border rounded border-gray-300">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 bg-[#ffffff] rounded-md file:mr-4 
                file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold 
                file:bg-blue-200 file:text-blue-500 hover:file:bg-blue-300 hover:file:cursor-pointer"
              />
            </div>
          </div>
          {image && (
            <div>
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-w-full w-72 h-auto rounded mx-auto"
              />
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base 
              font-semibold text-white outline-none hover:bg-[#5b56c5]"
            >
              Classify  
            </button>
          </div>
        </form>
      </div>
      {loading && (
        <div className="max-w-md p-6 bg-gray-100 rounded-md shadow-md ml-10 w-96 h-72 
          flex justify-center items-center">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            Classifying...
          </h2>
        </div>
      )}

      {classificationResult && !loading && (
        <div className="max-w-md p-6 bg-gray-100 rounded-md shadow-md ml-10 w-96 h-72 flex items-center">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            The image has been classified as{" "}
            <span className="text-blue-600">
              {classificationResult.class_label}
            </span>{" "}
            with a probability of{" "}
            <span className={classificationResult.class_probability >= 0.5 ? 'text-green-500' : 'text-red-500'}>
              {Math.round(classificationResult.class_probability * 100)}%
            </span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
