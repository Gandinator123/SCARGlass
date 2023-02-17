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
from SpeechFunctions import record_audio, audio_to_text, text_to_function, translate, scan_pdf, scan_qr, take_picture
from Home import TimeComponent, DateComponent, WeatherComponent
import threading
import smbus2  
from server import make_handler, get_ip_address
from http.server import HTTPServer
from Camera import Camera

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Configuration for pins:
cs_pin = digitalio.DigitalInOut(board.D5)
dc_pin = digitalio.DigitalInOut(board.D6)
reset_pin = digitalio.DigitalInOut(board.D4)
bl_pin = digitalio.DigitalInOut(board.D22)

BAUDRATE = 24000000 # max is 24MHz

SCREEN_WIDTH = 161
SCREEN_HEIGHT = 84
SCREEN_X_OFFSET = 0
SCREEN_Y_OFFSET = 22

BASE_URL = 'http://54.234.70.84:8000/'

OPERATIONS = [
    ('Translating...', translate), # translate()
    ('Scanning...', scan_pdf), # scan_pdf()
    ('Scanning...', scan_qr), # scan_qr()
    ('Hold still...', take_picture), # take_picture()
]
        
class Screen:
    def __init__(self):
        # GLOBALS
        self.screen_id = None
        self.global_state = -4

        button_t = threading.Thread(target=self.button_thread)
        button_t.start()

        temperature_t = threading.Thread(target=self.temperature_thread)
        temperature_t.start()

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

        # DRAWING SETUP
        self.image = Image.new("RGB", (SCREEN_WIDTH + SCREEN_X_OFFSET, SCREEN_HEIGHT + SCREEN_Y_OFFSET))
        self.draw = ImageDraw.Draw(self.image)

        # FONT
        self.fontSize = 12
        self.font = ImageFont.truetype("fonts/Montserrat-Medium.otf", self.fontSize)

        # CAMERA
        self.vs = Camera()

    def temperature_thread(self):
        bus = smbus2.SMBus(1)

        i=T0=T1=T2=T3=T4=Tav = 0

        while True:
            # reset device
            bus.write_byte(0x40, 0xfe)
            time.sleep(.3)

            bus.write_byte(0x40, 0xF3)
            err = True
            while err:
                try:
                    T_raw = bus.read_byte(0x40)
                    t_raw = T_raw + (T_raw << 8)
                    err = False
                except:
                    time.sleep(0.01)
                
            # compute and save humidity and temp values
            i += 1
            T4 = T3
            T3 = T2
            T2 = T1
            T1 = T0
            T0 = 175.72*t_raw/65536.0 - 46.85

            Tav += T0
            Tav -= T4

            if i > 4:
                # print("current temp {0} ".format(T0))
                # print("average temp {0} ".format(Tav / 4))

                if T0 > (Tav / 4) + 0.5:
                    if self.global_state == -4:
                        self.global_state = -3
            
            time.sleep(0.5)

    def button_thread(self):
        while True:
            if not GPIO.input(18):
                if self.global_state == 0:
                    self.global_state = 1
    
    def record_thread(self):
        record_audio()

    def stot_thread(self, result):
        result.append(audio_to_text())
        
    def preProcess(self):
        self.draw.rectangle((0, 0, SCREEN_WIDTH + SCREEN_X_OFFSET, SCREEN_HEIGHT + SCREEN_Y_OFFSET), outline=0, fill=self.background_color)

    def blackScreen(self):
        self.draw.rectangle((0, 0, SCREEN_WIDTH + SCREEN_X_OFFSET, SCREEN_HEIGHT + SCREEN_Y_OFFSET), outline=0, fill=(0, 0, 0))

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
                y -= (timeDelta - 2) * self.scroll_speed

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

    def status_message(self, text):

        text_arr = text.split('\n')
        longest_text = max(text_arr, key=len)
        (font_width, font_height) = self.font.getsize(longest_text)

        curr = time.time()
        while time.time()-curr < 3:
            self.preProcess()
            self.draw.text(
                (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height * len(text_arr) // 2),
                text,
                font=self.font,
                fill=self.fontColor,
            )
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
        op = text_to_function(result[0], self.screen_id)
        if isinstance(op, int):
            # op is operation 
            if op == 6:
                # turn off
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
                self.global_state = -4
                return
            
            elif op == 5:
                # reload
                self.global_state = -1
                return

            elif op == 4:
                # microphone error
                self.status_message('Error! Try again?\nWe thought you said:\n' + result[0])
                self.global_state = 0
                return

            # all other operations require camera: show preview then handle operation
            self.vs.start_stream()
            time.sleep(1)

            curr = time.time()
            while time.time() - curr < 5:
                self.preProcess()
                img = Image.fromarray(self.vs.read())
                img = img.resize((142, 80), Image.ANTIALIAS)
                self.image.paste(img, (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - 71, SCREEN_Y_OFFSET))
                self.postProcess()

            self.vs.start_capture()
            time.sleep(1)

            status_code = [None]
            self.vs.process(target=OPERATIONS[op][1], screen_id=self.screen_id, status_code=status_code)

            while self.vs.is_alive():
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

            # check status code to show success/error message
            if status_code[0] == 500:
                # error
                self.status_message("Error! Try again?")
            elif status_code[0] == 200:
                # success
                self.status_message("Success!")
            
            self.vs.stop()

        else:
            # op is text to render
            self.scroll(op)
        
        self.global_state = 0

    def server_thread(self):
        httpd = HTTPServer(('0.0.0.0', 8000), make_handler(screen=self))
        while not self.screen_id:
            httpd.serve_forever()

    def pair(self):
        self.blackScreen()
        text = "Pairing..."
        (font_width, font_height) = self.font.getsize(text)
        self.draw.text(
                (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height // 2),
                text,
                font=self.font,
                fill=(255, 255, 255),
            )
        self.postProcess()

        # start http server
        server_t = threading.Thread(target=self.server_thread)
        server_t.start()

        url = 'http://54.234.70.84:8000/pairings/create/'

        # every 60s post IP to server
        startTime = datetime.now()
        sent = False
        while self.global_state == -2:
            currentTime = datetime.now()
            timeDelta = int((currentTime - startTime).total_seconds())
            if timeDelta % 60 == 0:
                if not sent:
                    data = {
                        'ip': get_ip_address(),
                    }
                    response = requests.post(url, json=data)
                    print(response.text)
                    sent = True
            elif sent:
                sent = False

    def turnOn(self):
        # check if screen ID exists in file
        try:
            with open('screen_config.txt') as f_obj:
                contents = f_obj.read()
                contents = contents.strip().split('=')
                self.screen_id = contents[1]
                self.global_state = -1
        except FileNotFoundError:
            print("File does not exist")
            self.global_state = -2

    def welcome(self):
        # fetch screen data
        url = BASE_URL + 'screens/' + self.screen_id
        response = requests.get(url)
        x = response.json()
        self.background_color = (x['background_blue'], x['background_green'], x['background_red']) # BGR!
        font_color = (x['font_blue'], x['font_green'], x['font_red']) # BGR!
        time_format, date_format, day_format = x['time_format'], x['date_format'], x['day_format']
        self.scroll_speed_options = [5, 10, 20]
        self.scroll_speed = self.scroll_speed_options[x['scroll_speed']]

        # initialise components
        self.dateComponent = DateComponent(self.draw, date_format, day_format, font_color=font_color)
        self.timeComponent = TimeComponent(self.draw, time_format, font_color=font_color)
        self.weatherComponent = WeatherComponent(self.image, self.draw, font_color=font_color)
        self.fontColor = font_color

        # welcome user
        self.preProcess()
        text = "Hello " + x['user'] + '!'
        (font_width, font_height) = self.font.getsize(text)
        self.draw.text(
                (SCREEN_X_OFFSET + SCREEN_WIDTH // 2 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - font_height // 2),
                text,
                font=self.font,
                fill=self.fontColor,
            )
        self.postProcess()

        time.sleep(3)

        # move to home page
        self.global_state = 0

    def offState(self):
        self.blackScreen()
        self.postProcess()

    def run(self):
        while True:
            if self.global_state == -4:
                self.offState()
            elif self.global_state == -3:
                self.turnOn()
            elif self.global_state == -2:
                self.pair()
            elif self.global_state == -1:
                self.welcome()
            elif self.global_state == 0:
                self.homePage()
            elif self.global_state == 1:
                self.scrollPage()

screen = Screen()
screen.run()