from django.urls import path
from .views import UserCreate, UserList, UserDetail, UserSignin

urlpatterns = [
  path('', UserList.as_view(), name='User list'),
  path('create/', UserCreate.as_view(), name='User create'),
  path('signin/', UserSignin.as_view(), name='User sign in'),
  path('<uuid:pk>/', UserDetail.as_view(), name='User detail'),
]