import time
import busio
from PIL import Image, ImageDraw, ImageFont, ImageChops
from datetime import datetime
import requests
import json

SCREEN_WIDTH = 161
SCREEN_HEIGHT = 84
SCREEN_X_OFFSET = 0
SCREEN_Y_OFFSET = 22

BASE_URL = 'http://54.234.70.84:8000/'

class TimeComponent:
    def __init__(self, draw, time_format, font_color):
        self.draw = draw
        self.fontSize = 16
        self.font = ImageFont.truetype("Montserrat-Black.otf", self.fontSize)
        self.fontColor = font_color
        self.time_format = time_format
        self.time_formats = ["%H:%M:%S", "%H:%M", "%I:%M:%S %p", "%I:%M %p"]

    def show(self):
        currentDateAndTime = datetime.now()
        currentTime = currentDateAndTime.strftime(self.time_formats[self.time_format])
        (font_width, font_height) = self.font.getsize(currentTime)
        self.draw.text(
            (SCREEN_X_OFFSET, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 4),
            currentTime,
            font=self.font,
            fill=self.fontColor,
        )

class DateComponent:
    def __init__(self, draw, date_format, day_format, font_color):
        self.draw = draw
        self.fontSize = 12
        self.font = ImageFont.truetype("Montserrat-Medium.otf", self.fontSize)
        self.fontColor = font_color
        self.date_format = date_format
        self.date_formats = ['%d/%m/%Y']
        self.day_format = day_format
        self.day_formats = ['%A', '%a', '']

    def show(self):
        currentDateAndTime = datetime.now()
        currentTime = currentDateAndTime.strftime(self.day_formats[self.day_format] + ' ' + self.date_formats[self.date_format])
        currentTime = currentTime.split(' ')
        x = SCREEN_X_OFFSET
        y = SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2
        (font_width, font_height) = self.font.getsize(currentTime[0])
        self.draw.text(
            (x, y),
            currentTime[0],
            font=self.font,
            fill=self.fontColor,
        )
        y += font_height
        self.draw.text(
            (x, y),
            currentTime[1],
            font=self.font,
            fill=self.fontColor,
        )

class WeatherComponent:
    def __init__(self, image, draw, font_color):
        self.image = image
        self.draw = draw
        self.lastFetchedTime = None
        self.api_key = "604ea5d5a58895baa30295cfc16e074e"
        self.city = "London"
        self.icon = None
        self.temp = None
        self.fontSize = 12
        self.font = ImageFont.truetype("Montserrat-Medium.otf", self.fontSize)
        self.fontColor = font_color

    def fetchWeatherData(self):
        base_url = "http://api.openweathermap.org/data/2.5/weather?"
        url = base_url + "appid=" + self.api_key + "&q=" + self.city + "&units=metric"
        response = requests.get(url)
        x = response.json()
        print(x)
        if x["cod"] != "404":
            self.temp = str(x["main"]['temp']) + u'\N{DEGREE SIGN}' + 'C'
            print(self.temp)
            self.icon = x["weather"][0]['icon']
        
        self.lastFetchedTime = datetime.now()

    def show(self):
        currentTime = datetime.now()
        if self.lastFetchedTime is None:
            self.fetchWeatherData()
        elif (currentTime - self.lastFetchedTime).total_seconds() > 3600:
            self.fetchWeatherData()

        image = Image.open("icons/" + self.icon + ".png")
        (imageWidth, imageHeight) = image.size

        self.image.paste(image, (SCREEN_X_OFFSET + 3 * SCREEN_WIDTH // 4 - imageWidth // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 - imageHeight // 2), image)

        (font_width, font_height) = self.font.getsize(self.temp)
        self.draw.text(
            (SCREEN_X_OFFSET + 3 * SCREEN_WIDTH // 4 - font_width // 2, SCREEN_Y_OFFSET + SCREEN_HEIGHT // 2 + imageHeight // 4),
            self.temp,
            font=self.font,
            fill=self.fontColor
        )