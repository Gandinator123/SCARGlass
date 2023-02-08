from .models import UserModel
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserModel
    fields = '__all__'
    extra_kwargs = {
      'password': {'write_only': True}
    }

  def create(self, validated_data):
    user = UserModel.objects.create_user(
      email=validated_data['email'],
      name=validated_data['name'],
      password=validated_data['password']
    )
    return user

class UserSerializer(serializers.ModelSerializer):
  screens = serializers.RelatedField(source='ScreenModel', read_only=True)

  class Meta:
    model = UserModel
    fields = (
      'id',
      'email',
      'name',
      'date',
      'screens',
    )