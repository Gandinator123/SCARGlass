from django.urls import path
from .views import ScreenList, ScreenCreate, ScreenDetail

urlpatterns = [
    path('', ScreenList.as_view()),
    path('create/', ScreenCreate.as_view()),
    path('<int:pk>/', ScreenDetail.as_view()),
]