from django.urls import path
from .views import PhotoList

urlpatterns = [
    path('', PhotoList.as_view()),
]