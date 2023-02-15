from rest_framework import generics
from .models import QuestionModel
from .serializers import QuestionSerializer

class QuestionList(generics.ListAPIView):
  def get_queryset(self):
    queryset = QuestionModel.objects.all()
    screen_id = self.request.query_params.get('screen_id')
    if screen_id:
      queryset = queryset.filter(screen=screen_id)

    return queryset

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