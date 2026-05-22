from django.contrib import admin
from .models import Reminder

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'priority', 'reminder_time', 'created_at']
    list_filter = ['priority']
    search_fields = ['title', 'description']