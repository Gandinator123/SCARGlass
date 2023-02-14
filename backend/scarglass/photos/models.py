from django.db import models
from screen.models import ScreenModel

def upload_to(instance, filename):
  print(instance.screen.id)
  return '{filename}'.format(filename=filename)

class PhotoModel(models.Model):
  screen = models.ForeignKey(ScreenModel, on_delete=models.CASCADE, related_name="photos")
  photo = models.ImageField(upload_to=upload_to)
  text = models.TextField(blank=True, null=True)

  IMG_TYPE_CHOICES = (
    (0, 'None'),
    (1, 'Translate'),
    (2, 'QR'),
    (3, 'PDF'),
  )
  img_type = models.IntegerField(choices=IMG_TYPE_CHOICES, default=0)