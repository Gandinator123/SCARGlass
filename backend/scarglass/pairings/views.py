from rest_framework import generics
from .models import PairingModel
from .serializers import PairingSerializer

class PairingList(generics.ListAPIView):
  queryset = PairingModel.objects.all()
  serializer_class = PairingSerializer

class PairingCreate(generics.CreateAPIView):
  queryset = PairingModel.objects.all()
  serializer_class = PairingSerializer()

class PairingDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = PairingModel.objects.all()
  serializer_class = PairingSerializer