from django.urls import path
from .views import reminder_list

urlpatterns = [
    path('reminders/', reminder_list)
]

