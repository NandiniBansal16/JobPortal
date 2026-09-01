from rest_framework import serializers
from .models import Company, Job, Application, CandidateProfile, SavedJob

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('user',) 

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ('company',)

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    candidate_username = serializers.CharField(source='candidate.username', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('candidate', 'status')

class CandidateProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = CandidateProfile
        fields = '__all__'
        read_only_fields = ('user',)
class SavedJobSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    class Meta:
        model = SavedJob
        fields = '__all__'
        read_only_fields = ('user',)