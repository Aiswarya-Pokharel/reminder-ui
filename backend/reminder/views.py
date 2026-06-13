from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Reminder
from .serializer import ReminderSerializer
from rest_framework import status
from .ai_utils import extract_reminder_from_text, check_duplicate_with_ai

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
    

@api_view(['POST'])
def smart_create_reminder(req):
    """
    User sends: { "text": "pay electricity bill next month" }
    AI extracts the details, checks for duplicates, then saves.
    """
    user_text = req.data.get("text", "").strip()

    if not user_text:
        return Response({"error": "text field is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Step 1: Extract reminder details from plain text using AI
    try:
        extracted = extract_reminder_from_text(user_text)
    except Exception as e:
        return Response({"error": f"AI extraction failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Step 2: Check for duplicates against existing reminders
    existing_titles = list(Reminder.objects.values_list("title", flat=True))
    try:
        duplicate_check = check_duplicate_with_ai(extracted["title"], existing_titles)
    except Exception as e:
        return Response({"error": f"Duplicate check failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if duplicate_check["is_duplicate"]:
        return Response({
            "warning": "Similar reminder already exists",
            "matched_with": duplicate_check["matched_title"],
            "extracted": extracted
        }, status=status.HTTP_200_OK)

    # Step 3: Save the reminder
    data = {
        "title": extracted["title"],
        "description": extracted.get("description", ""),
        "reminder_time": extracted["reminder_time"],
        "priority": extracted.get("priority", "Medium"),
        "original_text": user_text
    }

    serializer = ReminderSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Reminder created successfully",
            "reminder": serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)