from rest_framework import serializers
from .models import ScreenModel
from users.models import UserModel

class ScreenSerializer(serializers.ModelSerializer):
  user = serializers.SlugRelatedField(slug_field='name', queryset=UserModel.objects.all())
  class Meta:
    model = ScreenModel
    fields = '__all__'