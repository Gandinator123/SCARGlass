from django.db import models

class QuestionModel(models.Model):
  question = models.CharField(max_length=255)
  response = models.CharField(max_length=255)