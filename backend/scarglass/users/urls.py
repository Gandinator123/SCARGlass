from django.urls import path
from .views import UserCreate, UserList, UserDetail, UserSignin
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
  path('', UserList.as_view(), name='User list'),
  path('register/', UserCreate.as_view(), name='User create'),
  path('signin/', UserSignin.as_view(), name='User sign in'),
  path('<int:pk>/', UserDetail.as_view(), name='User detail'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]