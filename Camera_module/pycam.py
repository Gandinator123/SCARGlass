from picamera import PiCamera
from time import sleep
import requests
import uuid
import os
camera = PiCamera()

## showing the camera...
img_name = str(uuid.uuid4())
camera.capture('/home/pi/Camera_module/{}.jpg'.format(img_name))

## sending the photo to the server
url = "http://54.234.70.84:8000/photos/create/"
data = {'screen': 1}
file = {
    'photo': open('/home/pi/Camera_module/{}.jpg'.format(img_name), 'rb'),
}
response = requests.post(url, data=data, files=file)

print(response.text)

os.remove('/home/pi/Camera_module/{}.jpg'.format(img_name))