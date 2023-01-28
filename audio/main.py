
import pyaudio
import wave
import speech_recognition as sr
from ctypes import *
from contextlib import contextmanager
from pyChatGPT import ChatGPT


#BEFORE RUNNING:
# 'pip3 install pyaudio, wave, SpeechRecognition, pyChatGPT



#-------CHAT GPT STUFF (not been implmented yet)-------------------------------
# session_token = "string_session_token"
# resp = api.send_message("Question to ask")
# print(resp['message'])
#-------------------------------------------------------------------------------



# ------------- THIS CODE SETS UP THE PARAMETERS FOR MIC RECORDING AND SHIT (LIKE DURATION OF RECORDING AND WHAT AUDIO INPUT IS BEING USED ETC) ---------------------
#The following code comes from markjay4k as referenced below
form_1 = pyaudio.paInt16
chans=1
samp_rate = 44100
chunk = 4096
record_secs = 5     #record time
dev_index = 0
wav_output_filename = 'test2.wav'

#------------------------------------------------------------------------------------------------------------------------------------------------------------------------


#--------------- RECORD AUDIO INPUT --------------------------------------------------------------------------------------------------------------------------------------
audio = pyaudio.PyAudio()
stream=audio.open(format = form_1,rate=samp_rate,channels=chans, input_device_index = dev_index, input=True, frames_per_buffer=chunk)
print("recording")
frames=[]

for ii in range(0,int((samp_rate/chunk)*record_secs)):
    data=stream.read(chunk,exception_on_overflow = False)
    frames.append(data)

print("finished recording")

stream.stop_stream()
stream.close()
audio.terminate()
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------



#---------------SAVE THE AUDIO FILE------------------------------------------------------------------------------------------------------------------------------------------
#creates wave file with audio read in
#Code is from the wave file audio tutorial as referenced below
wavefile=wave.open(wav_output_filename,'wb')
wavefile.setnchannels(chans)
wavefile.setsampwidth(audio.get_sample_size(form_1))
wavefile.setframerate(samp_rate)
wavefile.writeframes(b''.join(frames))
wavefile.close()
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------------





#----------------------TRANSLATE AUDIO FILE TO TEXT----------------------------------------------------------------------------------------------------------------------------
# Initialize recognizer class (for recognizing the speech)
r = sr.Recognizer()

# Reading Audio file as source
# listening the audio file and store in audio_text variable

with sr.AudioFile('/home/pi/test2.wav') as source:
    audio_text = r.listen(source)
# recoginize_() method will throw a request error if the API is unreachable, hence using exception handling
    try:
        
        # using google speech recognition
        text = r.recognize_google(audio_text)
        print('Converting audio transcripts into text ...')
        print(text)
     
    except:
        print('Sorry.. run again...')
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------