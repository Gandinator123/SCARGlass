from django.db import models
from screen.models import ScreenModel

def upload_to(instance, filename):
    return '{filename}'.format(filename=filename)

class PhotoModel(models.Model):
  screen = models.ForeignKey(ScreenModel, on_delete=models.CASCADE, related_name="photos")
  photo = models.ImageField(upload_to=upload_to)
