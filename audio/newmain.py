import pyaudio
import wave
import speech_recognition as sr
from ctypes import *
from contextlib import contextmanager
from pyChatGPT import ChatGPT


"""
translate, maths equation solving + pdf scanning
phrase including 'translate' and one of several predefined languages ['french', 'german', …]
phrase including 'scan' and 'pdf' e.g. 'scan this pdf'
phrase including 'solve'
e.g. 'solve this equation'
phrase including 'take' and 'picture' e.g. 'take a picture'
"""

FORM_1 = pyaudio.paInt16
CHANS=1
SAMP_RATE = 44100
CHUNK = 4096
RECORD_SECS = 10     #record time
DEV_INDEX = 0
WAV_OUTPUT_FILENAME = 'audio1.wav'
LANGUAGES = {"french", "german"}


def record_audio():
    audio = pyaudio.PyAudio()
    stream=audio.open(format = FORM_1,rate=SAMP_RATE,channels=CHANS, input_device_index = DEV_INDEX, input=True, frames_per_buffer=CHUNK)
    print("recording")
    frames=[]  
    for ii in range(0,int((SAMP_RATE/CHUNK)*RECORD_SECS)):
        data=stream.read(CHUNK,exception_on_overflow = False)
        frames.append(data)

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
        audio_to_text_error()
    
    word_set = text.lower().split().set()

    if 'translate' in word_set:
        for x in LANGUAGES: 
            if x in word_set:
                translate(x)
                return
        no_valid_function_error()
    
    elif 'scan' in word_set:
        scan_qr()

    elif 'solve' in word_set or 'equation' in word_set:
        solve_equation()

    elif 'take' in word_set or 'picture' in word_set():
        take_picture()

    elif 'question' in word_set:
        chat_gpt()

    else:
        no_valid_function_error()

    

def translate(language):
    print("we are translating using language: ", language)
    

def solve_equation():
    print("we are solving an equation")

def take_picture():
    print("we are taking a picture")

def scan_qr():
    print("we are scanning a qr code")

def chat_gpt():
    print("we are asking chat gpt")

def audio_to_text_error():
    print("there was an error recording and translating audio to text")

def no_valid_function_error():
    print("no valid function error")