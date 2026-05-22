from django.urls import path
from .views import reminder_list,  reminder_detail

urlpatterns = [
    path('reminders/', reminder_list),
    path('reminders/<int:pk>/', reminder_detail),
]

