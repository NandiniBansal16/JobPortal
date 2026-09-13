from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Company, Job, Application, CandidateProfile, SavedJob
from .serializers import CompanySerializer, JobSerializer, ApplicationSerializer, CandidateProfileSerializer, SavedJobSerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'location', 'company']
    search_fields = ['title', 'description', 'requirements']

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def matched(self, request):
        user = request.user
        
        if getattr(user, 'role', '') != 'candidate':
            return Response({"detail": "Only candidates get job matches."}, status=400)
            
        if not hasattr(user, 'candidate_profile'):
            return Response({"detail": "Create a profile with skills first."}, status=400)
            
        profile = user.candidate_profile
        
        if not profile.skills:
            return Response({"detail": "No skills found in your profile."}, status=400)
            
        user_skills = [skill.strip().lower() for skill in profile.skills.split(',')]
        
        jobs = Job.objects.filter(is_active=True)
        
        matched_jobs = []
        for job in jobs:
            score = 0
            job_text = f"{job.title} {job.description} {job.requirements}".lower()
            
            for skill in user_skills:
                if skill in job_text:
                    score += 1
                    
            if score > 0:
                job.match_score = score
                matched_jobs.append(job)
                
        matched_jobs.sort(key=lambda x: x.match_score, reverse=True)
    
        serializer = self.get_serializer(matched_jobs[:10], many=True)
        return Response(serializer.data)

    
class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employer':
            return Application.objects.filter(job__company=user.company)
        return Application.objects.filter(candidate=user)

    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)

class CandidateProfileViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return CandidateProfile.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)