from django.shortcuts import render
from rest_framework import generics, views, permissions, response, status
from .models import PhotoModel
from .serializer import PhotoSerializer
# from .photo_test import img_to_pdf, img_to_txt2

class PhotoList(generics.ListAPIView):
  queryset = PhotoModel.objects.all()
  serializer_class = PhotoSerializer

class PhotoCreate(views.APIView):
  def post(self, request, format=None):
    request.data._mutable = True
    request.data['text'] = "Some text!"
    request.data._mutable = False
    serializer = PhotoSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return response.Response(status=status.HTTP_200_OK)
    return response.Response(status=status.HTTP_400_BAD_REQUEST)

class PhotoDelete(generics.DestroyAPIView):
  queryset = PhotoModel.objects.all()
  serializer_class = PhotoSerializer