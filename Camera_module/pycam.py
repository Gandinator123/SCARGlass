from picamera import PiCamera
from time import sleep

camera = PiCamera()

## showing the camera...
camera.start_preview()
sleep(5)
camera.capture('/home/pi/Camera_module/image.jpg')
camera.stop_preview()