from django.urls import path
from .views import RegisterView, UserProfileView, ResumeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserProfileView.as_view(), name='profile'),
    path('resume/', ResumeView.as_view(), name='resume'),
]