from django.db import models
from screen.models import ScreenModel

class PhotoModel(models.Model):
  screen = models.ForeignKey(ScreenModel, on_delete=models.CASCADE, related_name="photos")
  photo = models.ImageField()
