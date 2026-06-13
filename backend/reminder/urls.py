from django.urls import path
from .views import reminder_list,  reminder_detail, smart_create_reminder

urlpatterns = [
    path('reminders/', reminder_list),
    path('reminders/smart-create/', smart_create_reminder),
    path('reminders/<int:pk>/', reminder_detail),
    
]

