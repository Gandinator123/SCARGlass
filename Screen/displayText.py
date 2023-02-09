import time
import busio
import digitalio
import RPi.GPIO as GPIO
import board
from PIL import Image, ImageDraw, ImageFont, ImageChops
from adafruit_rgb_display import st7735
from datetime import datetime
import requests
import json
from SpeechFunctions import record_audio, audio_to_text, text_to_function, translate, scan_pdf, scan_qr, save_text, take_picture, error
from Home import TimeComponent, DateComponent, WeatherComponent
import threading
import os

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Configuration for pins:
cs_pin = digitalio.DigitalInOut(board.D5)
dc_pin = digitalio.DigitalInOut(board.D6)
reset_pin = digitalio.DigitalInOut(board.D4)
bl_pin = digitalio.DigitalInOut(board.D22)

BAUDRATE = 10000000 # max is 24MHz

SCREEN_WIDTH = 161
SCREEN_HEIGHT = 84
SCREEN_X_OFFSET = 0
SCREEN_Y_OFFSET = 22

BASE_URL = 'http://54.234.70.84:8000/'

OPERATIONS = [
    ('Translating...', translate), # translate()
    ('Scanning...', scan_pdf), # scan_pdf()
    ('Scanning...', scan_qr), # scan_qr()
    ('Saving...', save_text), # solve_equation()
    ('Hold still...', take_picture), # take_picture()
    ('Oops! Try again?', error)
]
        
class Screen:
    def __init__(self):
        # GLOBALS
        self.global_state = -2
        key_t = threading.Thread(target=self.keypress_thread)
        key_t.start()

        # COMMS
        spi = board.SPI()

        # DISPLAY
        self.disp = st7735.ST7735S(
            spi,
            #rotation=90,  # 2.2", 2.4", 2.8", 3.2" ILI9341
            width=SCREEN_WIDTH + SCREEN_X_OFFSET,
            height=SCREEN_HEIGHT + SCREEN_Y_OFFSET,
            cs=cs_pin,
            dc=dc_pin,
            bl=bl_pin,
            rst=reset_pin,
            baudrate=BAUDRATE,
            x_offset=0,
            y_offset=0,
        )

        # API SCREEN DATA
        url = BASE_URL + 'screens/1/'
        # response = requests.get(url)
        #x = response.json()
        #self.background_color = (x['background_blue'], x['background_green'], x['background_red']) # BGR!
        # font_color = (x['font_blue'], x['font_green'], x['font_red']) # BGR!
        # time_format, date_format, day_format = x['time_format'], x['date_format'], x['day_format']
        self.background_color = (255, 255, 255) # BGR!
        self.black_background = (0, 0, 0)
        font_color = (0, 0, 0) # BGR!
        time_format, date_format, day_format = 0, 0, 0

        # FONT
        self.fontSize = 12
        self.font = ImageFont.truetype("fonts/Montserrat-Medium.otf", self.fontSize)
        self.fontColor = font_color

        # DRAWING SETUP
        self.image = Image.new("RGB", (SCREEN_WIDTH + SCREEN_X_OFFSET, SCREEN_HEIGHT + SCREEN_Y_OFFSET))
        self.draw = ImageDraw.Draw(self.image)
        self.preProcess()

        # HOME PAGE
        self.dateComponent = DateComponent(self.draw, date_format, day_format, font_color=font_color)
        self.timeComponent = TimeComponent(self.draw, time_format, font_color=font_color)
        self.weatherComponent = WeatherComponent(self.image, self.draw, font_color=font_color)

        # SCROLL PAGE -> prefer this to be its own class but need to think more about how

    def keypress_thread(self):
        while True:
            if not GPIO.input(18):
                if self.global_state == -2:
                    self.global_state = -1
                elif self.global_state == 0:
                    self.global_state = 1
            
    
    def record_thread(self):
        record_audio()

    def stot_thread(self, result):
        result.append(audio_to_text())
        
    def preProcess(self):
        self.draw.rectangle((0, 0, SCREEN_WIDTH + SCREEN_X_OFFSET, SCREEN_HEIGHT + SCREEN_Y_OFFSET), outline=0, fill=self.background_color)

    def blackScreen(self):
        self.draw.rectangle((0, 0, SCREEN_WIDTH + SCREEN_X_OFFSET, SCREEN_HEIGHT + SCREEN_Y_OFFSET), outline=0, fill=self.black_background)

    def postProcess(self):
        image = ImageChops.invert(self.image)
        self.disp.image(image)

    def scroll(self, text):
        startTime = datetime.now()

        x, y = SCREEN_X_OFFSET, SCREEN_Y_OFFSET

        while y >= SCREEN_Y_OFFSET:
            self.preProcess()
            currentTime = datetime.now()
            timeDelta = (currentTime - startTime).total_seconds()

            text_split = text.split(' ')
            
            x, y = SCREEN_X_OFFSET, SCREEN_Y_OFFSET
            if timeDelta > 2:
                y -= (timeDelta - 2) * 10

            for word in text_split:
                word += ' '
                (font_width, font_height) = self.font.getsize(word)

                if x + font_width > SCREEN_WIDTH:
                    x = SCREEN_X_OFFSET
                    y += font_height

                self.draw.text(
                    (x, y),
                    word,
                    font=self.font,
                    fill=self.fontColor,
                )

                x += font_width                

            self.postProcess()

    def homePage(self):
        self.preProcess()
        self.dateComponent.show()
        self.timeComponent.show()
        self.weatherComponent.show()
        self.postProcess()


    def scrollPage(self):
        # start recording
        record_t = threading.Thread(target=self.record_thread)
        record_t.start()

        # while recording, show it's recording
        while record_t.is_alive():
            self.preProcess()
            text = 'Recording...'
            (font_width, font_height) = self.font.getsize(text)
            self.draw.text(
                (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height // 2),
                text,
                font=self.font,
                fill=self.fontColor,
            )
            self.postProcess()
        

        result = []
        stot_t = threading.Thread(target=self.stot_thread, args=[result])
        stot_t.start()

        while stot_t.is_alive():
            self.preProcess()
            text = 'Processing...'
            (font_width, font_height) = self.font.getsize(text)
            self.draw.text(
                (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height // 2),
                text,
                font=self.font,
                fill=self.fontColor,
            )
            self.postProcess()

        # handle text
        print(result)
        op = text_to_function(result[0])
        if isinstance(op, int):
            # op is operation 
            if op == 6:
                curr = time.time()
                while time.time()-curr < 5:
                    self.preProcess()
                    text = "turning off!"
                    (font_width, font_height) = self.font.getsize(text)
                    self.draw.text(
                            (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height // 2),
                            text,
                            font=self.font,
                            fill=self.fontColor,
                        )
                    self.postProcess()
                print("done")
                self.global_state = -2
                return

            op_t = threading.Thread(target=OPERATIONS[op][1])
            op_t.start()

            while op_t.is_alive():
                self.preProcess()
                text = OPERATIONS[op][0]
                (font_width, font_height) = self.font.getsize(text)
                self.draw.text(
                    (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height // 2),
                    text,
                    font=self.font,
                    fill=self.fontColor,
                )
                self.postProcess()

        else:
            # op is text to render
            # TODO show question too
            self.scroll(op)
        
        self.global_state = 0
    
    def turnOn(self):
        curr = time.time()
        while time.time()-curr < 5:
            self.preProcess()
            text = "hello friend!"
            (font_width, font_height) = self.font.getsize(text)
            self.draw.text(
                    (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height // 2),
                    text,
                    font=self.font,
                    fill=self.fontColor,
                )
            self.postProcess()
        self.global_state = 0

    def offState(self):
        self.preProcess()
        text = "I'm off!"
        (font_width, font_height) = self.font.getsize(text)
        self.draw.text(
                (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height // 2),
                text,
                font=self.font,
                fill=self.fontColor,
            )
        self.postProcess

    def run(self):
        while True:
            if self.global_state == -2:
                self.blackScreen()
                text = "I'm off"
                (font_width, font_height) = self.font.getsize(text)
                self.draw.text(
                    (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height // 2),
                    text,
                    font=self.font,
                    fill=self.fontColor,
                )
                self.postProcess()
            elif self.global_state == -1:
                print("turning on")
                screen.turnOn()
            elif self.global_state == 0:
                print("home page")
                screen.homePage()
            elif self.global_state == 1:
                print("scroll page")
                screen.scrollPage()

screen = Screen()
screen.run()