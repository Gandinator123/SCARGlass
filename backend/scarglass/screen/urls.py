from django.urls import path
from .views import ScreenList, ScreenCreate, ScreenDetail, ScreenUpdate

urlpatterns = [
    path('', ScreenList.as_view()),
    path('create/', ScreenCreate.as_view()),
    path('<int:pk>/', ScreenDetail.as_view()),
    path('<int:pk>/update/', ScreenUpdate.as_view()),
]