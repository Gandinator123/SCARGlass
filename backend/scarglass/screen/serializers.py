from rest_framework import serializers
from .models import ScreenModel

class ScreenSerializer(serializers.ModelSerializer):
  user = serializers.SlugRelatedField(slug_field='name')
  class Meta:
    model = ScreenModel
    fields = '__all__'