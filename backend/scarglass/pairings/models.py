from django.db import models

class PairingModel(models.Model):
  ip = models.CharField(max_length=255)
  paired = models.BooleanField(default=False)
  date = models.DateTimeField(auto_now_add=True)

  def __str__(self):
      return self.ip
  