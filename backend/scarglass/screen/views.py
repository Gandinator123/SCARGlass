from rest_framework import generics, permissions
from .models import ScreenModel
from .serializers import ScreenSerializer

# Create your views here.
class ScreenList(generics.ListAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer

class ScreenCreate(generics.CreateAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer
  permission_classes = (permissions.IsAuthenticated,)

class ScreenDetail(generics.RetrieveAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer

class ScreenUpdate(generics.RetrieveUpdateDestroyAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer

  def put(self, request, *args, **kwargs):
    return self.partial_update(request, *args, **kwargs)