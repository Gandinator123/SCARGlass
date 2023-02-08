from rest_framework import generics, permissions, views
from .models import ScreenModel
from .serializers import ScreenSerializer

# Create your views here.
class ScreenList(generics.ListAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer

class ScreenCreate(views.APIView):
  permission_classes = (permissions.IsAuthenticated,)

  def post(self, request, format=None):
    user = request.user.id
    print(user)

class ScreenDetail(generics.RetrieveAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer

class ScreenUpdate(generics.RetrieveUpdateDestroyAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer

  def put(self, request, *args, **kwargs):
    return self.partial_update(request, *args, **kwargs)