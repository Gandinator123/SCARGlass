from .models import UserModel
from rest_framework import generics, permissions, response, status, views
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import authenticate

class UserCreate(generics.CreateAPIView):
  serializer_class = RegisterSerializer

class UserList(generics.ListAPIView):
  serializer_class = UserSerializer
  queryset = UserModel.objects.all()

  def filter_queryset(self, queryset):
    token = self.request.user.id
    if token is not None:
      queryset = queryset.filter(id=token)
    return queryset

  def list(self, request):
    queryset = self.filter_queryset(self.get_queryset())
    serializer = self.get_serializer(queryset, many=True)
    return response.Response(serializer.data)

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = UserSerializer
  queryset = UserModel.objects.all()

def getTokens(user):
  refresh = RefreshToken.for_user(user)

  return {
    'refresh': str(refresh),
    'access': str(refresh.access_token)
  }

class UserSignin(views.APIView):
  def post(self, request, format=None):
    data =request.data
    resp = response.Response()
    email = data.get('email', None)
    password = data.get('password', None)
    user = authenticate(email=email, password=password)

    if user is not None:
      if user.is_active:
        data = getTokens(user)
        resp.data = {
          'message': 'success',
          'access': data['access'],
          'refresh': data['refresh'],
          'data': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
          }
        }

        return resp
      else:
        return response.Response({'message': 'Account not active'}, status=status.HTTP_404_NOT_FOUND)
    else:
      return response.Response({'message': 'Invalid username or password'}, status=status.HTTP_404_NOT_FOUND)