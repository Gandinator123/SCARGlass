from django.db import models

class ScreenModel(models.Model):
  time_red = models.IntegerField(default=255)
  time_green = models.IntegerField(default=255)
  time_blue = models.IntegerField(default=255)
  time_font = models.CharField(max_length=255, default='Montserrat-Black')
  time_size = models.IntegerField(default=16)

  TIME_CHOICES = (
    (0, '%H:%M:%S'),
    (1, '%H:%M'),
    (2, '%I:%M:%S %p'),
    (3, '%I:%M %p'),
  )
  time_format = models.IntegerField(choices=TIME_CHOICES, default=0)

  date_red = models.IntegerField(default=255)
  date_green = models.IntegerField(default=255)
  date_blue = models.IntegerField(default=255)
  date_font = models.CharField(max_length=255, default='Montserrat-Medium')
  date_size = models.IntegerField(default=12)

  DAY_CHOICES = (
    (0, '%A'),
    (1, '%a'),
    (2, '')
  )
  day_format = models.IntegerField(choices=DAY_CHOICES, default=0)

  DATE_CHOICES = (
    (0, '%d/%m/%Y'),
    (1, '%d/%m/%y'),
  )
  date_format = models.IntegerField(choices=DATE_CHOICES, default=0)

  background_red = models.IntegerField(default=255)
  background_green = models.IntegerField(default=255)
  background_blue = models.IntegerField(default=255)

  font_red = models.IntegerField(default=255)
  font_green = models.IntegerField(default=255)
  font_blue = models.IntegerField(default=255)