from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Reminder
from .serializer import ReminderSerializer
from rest_framework import status

@api_view(['GET', 'POST'])
def reminder_list(req):
    if req.method == 'GET':
        reminders = Reminder.objects.all()
        serializer = ReminderSerializer(reminders, many=True)
        return Response(serializer.data)
    
    elif req.method == 'POST':
        serializer = ReminderSerializer(data=req.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)