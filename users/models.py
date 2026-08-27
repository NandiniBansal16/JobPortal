from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('candidate', 'Candidate'),
        ('employer', 'Employer'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='candidate')
    
    # We can add more fields here later if needed (e.g., phone number, profile picture)

    def __str__(self):
        return f"{self.username} ({self.role})"
    

class Resume(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='resume')
    resume_file = models.FileField(upload_to='resumes/')
    skills = models.TextField(help_text="Comma separated skills")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Resume"