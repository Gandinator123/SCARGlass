from rest_framework import generics, permissions, views, response, status
from .models import ScreenModel
from .serializers import ScreenSerializer

# Create your views here.
class ScreenList(generics.ListAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer

class ScreenCreate(views.APIView):
  permission_classes = (permissions.IsAuthenticated,)

  def post(self, request, format=None):
    print(request.user.id)
    user = request.user
    request.data['user'] = user
    serializer = ScreenSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return response.Response(serializer.data, status=status.HTTP_200_OK)
    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ScreenDetail(generics.RetrieveAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer

class ScreenUpdate(generics.RetrieveUpdateDestroyAPIView):
  queryset = ScreenModel.objects.all()
  serializer_class = ScreenSerializer

  def put(self, request, *args, **kwargs):
    return self.partial_update(request, *args, **kwargs)