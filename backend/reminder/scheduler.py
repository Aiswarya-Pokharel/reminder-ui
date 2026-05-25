from apscheduler.schedulers.background import BackgroundScheduler
from django.utils import timezone
from .models import Reminder

def fire_reminders():
    now = timezone.now()
    pending = Reminder.objects.filter(
        reminder_time__lte=now,
        is_fired=False
    )
    for reminder in pending:
        print(f"🔔 REMINDER: {reminder.title} — {reminder.description}")
        reminder.is_fired = True
        reminder.save()

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(fire_reminders, 'interval', seconds=60)
    scheduler.start()