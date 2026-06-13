from rest_framework import serializers
from .models import Reminder

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'title', 'description', 'reminder_time', 
                  'priority', 'is_fired', 'original_text', 'created_at']