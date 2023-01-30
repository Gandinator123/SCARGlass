from .views import QuestionCreate, QuestionDelete, QuestionDetail, QuestionList

urlpatterns = [
    path('', QuestionList.as_view()),
    path('create/', QuestionCreate.as_view()),
    path('<int:pk>/', QuestionDetail.as_view()),
    path('<int:pk>/delete/', QuestionDelete.as_view()),
]