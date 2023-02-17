from picamera.array import PiRGBArray
from picamera import PiCamera
import threading


class Camera:
	# def __init__(self, resolution=(320, 240), framerate=30):
	# 	self.setup()

	def setup(self, resolution=(320, 240), framerate=32):
		self.camera = PiCamera()
		self.camera.framerate = framerate
		self.camera.resolution = resolution
		self.camera.sensor_mode = 2
		self.rawCapture = PiRGBArray(self.camera, size=resolution)
		self.stream = self.camera.capture_continuous(self.rawCapture, format="rgb", use_video_port=True)
      
		# initialize the frame and the variable used to indicate if the thread should be stopped
		self.frame = None
		self.stopped = False
		self.isStopped = False

		self.t = None

	def start_stream(self):
		self.setup(resolution=(426, 240))
		self.start_thread()

	def start_capture(self):
		self.stop()
		while self.t.is_alive():
			pass

		self.setup(resolution=(1920, 1080))
		self.start_thread()
	
	def start_thread(self):
		# start the thread to read frames from the video stream
		self.t = threading.Thread(target=self.update, args=())
		self.t.start()
		return self

	def update(self):
		# keep looping infinitely until the thread is stopped
		for f in self.stream:
			# grab the frame from the stream and clear the stream in
			# preparation for the next frame
			self.frame = f.array
			self.rawCapture.truncate(0)
			# if the thread indicator variable is set, stop the thread
			# and resource camera resources
			if self.stopped:
				self.stream.close()
				self.rawCapture.close()
				self.camera.close()
				return
	
	def read(self):
		# return the frame most recently read
		return self.frame

	def process(self, target, screen_id, status_code):
			# process the image with the required operation
			self.op_t = threading.Thread(target=target, args=(screen_id, self.read(), status_code))
			self.op_t.start()

	def is_alive(self):
			return self.op_t.is_alive()

	def stop(self):
		# indicate that the thread should be stopped
		self.stopped = True