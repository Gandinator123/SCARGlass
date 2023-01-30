from rest_framework import generics
from .models import QuestionModel
from .serializers import QuestionSerializer

class QuestionList(generics.ListAPIView):
  queryset = QuestionModel.objects.all()
  serializer_class = QuestionSerializer

class QuestionCreate(generics.CreateAPIView):
  queryset = QuestionModel.objects.all()
  serializer_class = QuestionSerializer

class QuestionDetail(generics.RetrieveAPIView):
  queryset = QuestionModel.objects.all()
  serializer_class = QuestionSerializer

class QuestionDelete(generics.DestroyAPIView):
  queryset = QuestionModel.objects.all()
  serializer_class = QuestionSerializer