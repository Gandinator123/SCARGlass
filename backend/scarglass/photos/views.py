from django.shortcuts import render
from rest_framework import generics, views, permissions, response, status
from .models import PhotoModel
from .serializer import PhotoSerializer
# from .photo_test import img_to_pdf, img_to_txt2
from .img_to_txt2 import translate
import copy
import cv2
import numpy
from PIL import Image
import imutils
from skimage.filters import threshold_local
from imutils.perspective import four_point_transform
import sys
from io import BytesIO
from django.core.files import File
from scarglass.settings import MEDIA_URL
import os

class PhotoList(generics.ListAPIView):
  
  def get_queryset(self):
    queryset = PhotoModel.objects.all()
    img_type = self.request.query_params.get('img_type')
    screen_id = self.request.query_params.get('screen_id')
    if img_type:
      queryset = queryset.filter(img_type=img_type)
    if screen_id:
      queryset = queryset.filter(screen=screen_id)

    return queryset

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
      temp = copy.deepcopy(request.data['photo'])
      print(temp)
      img = cv2.imdecode(numpy.fromstring(temp.read(), numpy.uint8), cv2.IMREAD_COLOR)
      detect = cv2.QRCodeDetector()
      text, points, straight_qrcode = detect.detectAndDecode(img)
      print(text)
      print(points)
      print(straight_qrcode)
      request.data._mutable = True
      request.data['text'] = text
      request.data._mutable = False

    elif img_type == '3':
      # PDF
      temp = copy.deepcopy(request.data['photo'])
      big_img = cv2.imdecode(numpy.fromstring(temp.read(), numpy.uint8), cv2.IMREAD_COLOR)
      ratio = big_img.shape[0] / 500.0
      org = big_img.copy()
      img = imutils.resize(big_img, height = 500)
      gray_img = cv2.cvtColor(img.copy(),cv2.COLOR_BGR2GRAY)
      blur_img = cv2.GaussianBlur(gray_img,(5,5),0)
      edged_img = cv2.Canny(blur_img,75,200)
      cnts,_ = cv2.findContours(edged_img.copy(),cv2.RETR_LIST,cv2.CHAIN_APPROX_SIMPLE)
      cnts = sorted(cnts,key=cv2.contourArea,reverse=True)[:5]
      for c in cnts:
          peri = cv2.arcLength(c,True)
          approx = cv2.approxPolyDP(c,0.02*peri,True)
          if len(approx)==4:
              doc = approx
              break
      p=[]
      for d in doc:
          tuple_point = tuple(d[0])
          cv2.circle(img,tuple_point,3,(0,0,255),4)
          p.append(tuple_point)
      warped = four_point_transform(org, doc.reshape(4, 2) * ratio)
      warped = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
      T = threshold_local(warped, 11, offset = 10, method = "gaussian")
      warped = (warped > T).astype("uint8") * 255

      out = imutils.resize(warped, height = 650)

      new = Image.fromarray(img)

      # new.save(, 'JPEG', quality=85)
      path, ext = os.path.splitext(temp.name)
      p = '/home/ubuntu/SCARGlass/backend/media/' + path + '.pdf'
      new.save(p, format="PDF")

      request.data._mutable = True
      request.data['text'] = p
      request.data._mutable = False

      # request.data._mutable = True
      # request.data['photo'] = File(imgio, name=temp.name)
      # request.data._mutable = False

    serializer = PhotoSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return response.Response(serializer.data, status=status.HTTP_200_OK)
    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PhotoDelete(generics.RetrieveUpdateDestroyAPIView):
  queryset = PhotoModel.objects.all()
  serializer_class = PhotoSerializer