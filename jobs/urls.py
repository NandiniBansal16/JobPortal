from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, JobViewSet, ApplicationViewSet, CandidateProfileViewSet, SavedJobViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'profiles', CandidateProfileViewSet, basename='profile')
router.register(r'saved-jobs', SavedJobViewSet, basename='saved-job')

urlpatterns = [
    path('', include(router.urls)),
]