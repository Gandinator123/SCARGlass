from rest_framework import serializers
from .models import PairingModel

class PairingSerializer(serializers.ModelSerializer):
  class Meta:
    model = PairingModel
    fields = '__all__'