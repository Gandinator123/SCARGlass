from django.shortcuts import render
from rest_framework import generics
from .models import PhotoModel
from .serializer import PhotoSerializer

class PhotoList(generics.ListAPIView):
  queryset = PhotoModel.objects.all()
  serializer_class = PhotoSerializer

class PhotoCreate(generics.CreateAPIView):
  queryset = PhotoModel.objects.all()
  serializer_class = PhotoSerializer