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