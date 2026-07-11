from django.db import models

class Reminder(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reminder_time = models.DateTimeField()
    priority = models.CharField(max_length=50, choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')], default='Medium')
    is_fired      = models.BooleanField(default=False) 
    original_text = models.TextField(blank=True) 

    def __str__(self):
      return self.title
  