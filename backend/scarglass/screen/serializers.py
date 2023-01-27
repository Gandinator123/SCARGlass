from rest_framework import serializers
from .models import ScreenModel

class ScreenSerializer(serializers.ModelSerializer):
  class Meta:
    model = ScreenModel
    fields = '__all__'