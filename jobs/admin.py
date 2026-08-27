from django.contrib import admin
from .models import Company, Job
from .models import Application
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'is_active', 'created_at')
    list_filter = ('is_active', 'job_type', 'location')
    search_fields = ('title', 'company__name', 'location')

admin.site.register(Company)
admin.site.register(Job, JobAdmin)

admin.site.register(Application)