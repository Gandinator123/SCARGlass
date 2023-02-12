from rest_framework import serializers
from .models import ScreenModel
from users.serializers import UserSerializer

class ScreenSerializer(serializers.ModelSerializer):
  # user = serializers.SlugRelatedField(slug_field='name')
  user = UserSerializer()

  class Meta:
    model = ScreenModel
    fields = '__all__'