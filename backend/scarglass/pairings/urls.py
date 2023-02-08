from django.urls import path
from .views import PairingCreate, PairingDetail, PairingList

urlpatterns = [
    path('', PairingList.as_view()),
    path('create/', PairingCreate.as_view()),
    path('<int:pk>/', PairingDetail.as_view()),
]