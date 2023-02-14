from django.db import models
from screen.models import ScreenModel

class QuestionModel(models.Model):
  screen = models.ForeignKey(ScreenModel, on_delete=models.CASCADE, related_name="questions")
  question = models.CharField(max_length=255)
  response = models.TextField()