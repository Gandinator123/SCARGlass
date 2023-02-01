from django.shortcuts import render
from rest_framework import generics, views, permissions, response, status
from .models import PhotoModel
from .serializer import PhotoSerializer
# from .photo_test import img_to_pdf, img_to_txt2
from .img_to_txt2 import translate
import copy
import cv2

class PhotoList(generics.ListAPIView):
  queryset = PhotoModel.objects.all()
  serializer_class = PhotoSerializer

class PhotoCreate(views.APIView):
  def post(self, request, format=None):
    img_type = request.data['img_type']

    if img_type == '0':
      # NOTHING
      pass

    elif img_type == '1':
      # TRANSLATE
      temp = copy.deepcopy(request.data['photo'])
      text = translate(temp)
      request.data._mutable = True
      request.data['text'] = text
      request.data._mutable = False
    
    elif img_type == '2':
      # QR
      img = cv2.imread(path)
      detect = cv2.QRCodeDetector()
      value, points, straight_qrcode = detect.detectAndDecode(img)
      print(value)

    elif img_type == '3':
      # PDF
      pass    

    serializer = PhotoSerializer(data=request.data)
    if serializer.is_valid():
      # serializer.save()
      return response.Response(serializer.data, status=status.HTTP_200_OK)
    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PhotoDelete(generics.DestroyAPIView):
  queryset = PhotoModel.objects.all()
  serializer_class = PhotoSerializer