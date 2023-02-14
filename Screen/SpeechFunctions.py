import time
import pyaudio
import RPi.GPIO as GPIO
import wave
import speech_recognition as sr
from ctypes import *
from contextlib import contextmanager
from picamera import PiCamera
import requests
import uuid
import os
import json
from PIL import Image

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)

"""
translate, maths equation solving + pdf scanning
phrase including 'translate' and one of several predefined languages ['french', 'german', …]
phrase including 'scan' and 'pdf' e.g. 'scan this pdf'
phrase including 'solve'
e.g. 'solve this equation'
phrase including 'take' and 'picture' e.g. 'take a picture'
"""
OPENAI_API_KEY = "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"
FORM_1 = pyaudio.paInt16
CHANS=1
SAMP_RATE = 44100
CHUNK = 4096
RECORD_SECS = 3     #record time
DEV_INDEX = 0
WAV_OUTPUT_FILENAME = 'audio1.wav'
LANGUAGES = {"french"}

def record_audio():
    audio = pyaudio.PyAudio()
    stream=audio.open(format = FORM_1,rate=SAMP_RATE,channels=CHANS, input_device_index = DEV_INDEX, input=True, frames_per_buffer=CHUNK)
    print("recording")
    frames=[]

    for ii in range(0,int((SAMP_RATE/CHUNK)*RECORD_SECS)):
        data=stream.read(CHUNK,exception_on_overflow = False)
        frames.append(data)

    while True:
        data=stream.read(CHUNK,exception_on_overflow = False)
        frames.append(data)
        if GPIO.input(18):
            break

    print("finished recording")

    stream.stop_stream()
    stream.close()
    audio.terminate()
    wavefile=wave.open(WAV_OUTPUT_FILENAME,'wb')
    wavefile.setnchannels(CHANS)
    wavefile.setsampwidth(audio.get_sample_size(FORM_1))
    wavefile.setframerate(SAMP_RATE)
    wavefile.writeframes(b''.join(frames))
    wavefile.close()

def audio_to_text():
    r = sr.Recognizer()
    # Reading Audio file as source
    # listening the audio file and store in audio_text variable

    with sr.AudioFile('/home/pi/audio1.wav') as source:
        audio_text = r.listen(source)
    # recoginize_() method will throw a request error if the API is unreachable, hence using exception handling
        try:
            
            # using google speech recognition
            text = r.recognize_google(audio_text)
            return text
        
        except:
            return ("error")

def text_to_function(text):
    if text == 'error':
        error(None, None)

    if text.lower().split()[0] == 'question':
        text = text[8:]
        return chat_gpt(text)
        
    word_set = set(text.lower().split(' '))

    # TODO handle this
    if 'translate' in word_set:
        # for x in LANGUAGES: 
        #     if x in word_set:
        #         translate(x)
        #         return
        # error()
        return 0
    
    elif 'scan' in word_set and 'pdf' in word_set:
        # scan_pdf()
        return 1
    
    elif 'scan' in word_set and 'qr' in word_set:
        #scan_qr()
        return 2

    elif 'take' in word_set and ('picture' in word_set or 'photo' in word_set):
        # take_picture()
        return 3

    elif 'reload' in word_set:
        return 5

    elif 'turn' in word_set and 'off' in word_set:
        return 6

    else:
        # no_valid_function_error()
        return 4

def camera_to_server(image, screen_id, img_type):
    img_name = str(uuid.uuid4())
    img = Image.fromarray(image, "RGB")
    img.save('/home/pi/{}.jpg'.format(img_name))

    ## sending the photo to the server
    url = "http://54.234.70.84:8000/photos/create/"
    data = {'screen': screen_id, 'img_type': img_type}
    file = {
        'photo': open('/home/pi/{}.jpg'.format(img_name), 'rb'),
    }
    response = requests.post(url, data=data, files=file)

    print(response.text)

    os.remove('/home/pi/{}.jpg'.format(img_name))

def take_picture(screen_id, image):
    camera_to_server(image, screen_id, 0)

# post to url: base_url + 'photos/create/
# look at take picture, but:
# img_type: 1 -> translate, 2-> qr, 3 -> pdf

# TODO
def translate(screen_id, image):
    camera_to_server(image, screen_id, 1)
    print("we are translating")

# TODO
def scan_qr(screen_id, image):
    camera_to_server(image, screen_id, 2)
    print("We are scanning a qr code")

# TODO
def scan_pdf(screen_id, image):
    camera_to_server(image, screen_id, 3)
    print("we are scanning a pdf")

def chat_gpt(text):
    api_key = OPENAI_API_KEY
    url = 'https://api.openai.com/v1/completions'
    data = {
        'model': 'text-davinci-003',
        'prompt': text,
        'temperature': 0,
        'max_tokens': 100,
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer {}".format(OPENAI_API_KEY)
    }

    response = requests.post(url, json=data, headers=headers)
    r = json.loads(response.content)['choices'][0]['text']

    # post to server
    data = {
        'question': text,
        'response': r
    }
    response = requests.post('http://54.234.70.84:8000/questions/create/', json=data)
    print(response.text)

    return r

def error(screen_id, image):
    time.sleep(2)
    return "no valid function error"