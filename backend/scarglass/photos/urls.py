from django.urls import path
from .views import PhotoList, PhotoCreate

urlpatterns = [
    path('', PhotoList.as_view()),
    path('create/', PhotoCreate.as_view()),
]