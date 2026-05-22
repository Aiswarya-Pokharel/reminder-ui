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
    
@api_view(['GET', 'PUT', 'DELETE'])
def reminder_detail(req,pk):
    try:
        reminder = Reminder.objects.get(pk=pk)
    except Reminder.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if req.method == "GET":
        serializer = ReminderSerializer(reminder)
        return Response(serializer.data)
    
    elif req.method == "PUT":
        serializer = ReminderSerializer(reminder, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif req.method == "DELETE":
        reminder.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)