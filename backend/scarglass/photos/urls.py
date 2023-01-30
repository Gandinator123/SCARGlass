from django.urls import path
from .views import PhotoList, PhotoCreate, PhotoDelete

urlpatterns = [
    path('', PhotoList.as_view()),
    path('create/', PhotoCreate.as_view()),
    path('<int:pk>/delete/', PhotoDelete.as_view()),
]