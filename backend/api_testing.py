# Script for testing an image upload API endpoint 

import requests
from pathlib import Path

# URL of the API endpoint for uploading images
url = 'http://127.0.0.1:8000/upload/'
image_path=Path(input('Enter path of image: '))

# Create a dictionary containing the image file to be uploaded
files = {'image': open (image_path, 'rb')}

# Send a POST request to the API endpoint with the image file
response = requests.post(url,files=files)

print(response.text)