import os
import json
from datetime import datetime
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def extract_reminder_from_text(user_text):
    user_text = user_text.lower()
    today = datetime.now().strftime("%Y-%m-%d")

    prompt = f"""
    Today's date is: {today}

    User input: "{user_text}"

    You must return ONLY a valid JSON object. No explanation, no markdown, no extra text.

    Use these EXACT time rules based on keywords in the user input:
    - Match keywords case-insensitively (e.g. "Water", "WATER", "water" all match)
    - Contains "water", "exercise", "breakfast", "medicine", "morning" → time must be 07:00:00
    - Contains "homework", "meeting", "report", "study", "work" → time must be 09:00:00
    - Contains "lunch", "nap", "afternoon" → time must be 13:00:00
    - Contains "dinner", "walk", "read", "evening" → time must be 19:00:00
    - Contains "bill", "payment", "pay" → time must be 10:00:00
    - Anything else → time must be 09:00:00

    If the user mentions a specific time, use that instead of the rules above.
    If no date is mentioned, use today's date: {today}
    If user says "tomorrow", add 1 day. If "next month", use 1st of next month.

    Priority rules:
    - High if input contains: urgent, important, asap, critical
    - Low if input is casual or simple
    - Medium otherwise

    Return this exact JSON structure:
    {{
    "title": "short reminder title",
    "description": "a short helpful sentence about this reminder, never empty",
    "reminder_time": "{today} 07:00:00",
    "priority": "Low or Medium or High"
    }}
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
        temperature=0.1  # low = more consistent/accurate output
    )

    raw = response.choices[0].message.content.strip()
    return json.loads(raw)


def check_duplicate_with_ai(new_title, existing_titles):
    if not existing_titles:
        return {"is_duplicate": False, "matched_title": None}

    existing_list = "\n".join(f"- {t}" for t in existing_titles)

    prompt = f"""
You are checking if a new reminder is a duplicate of existing reminders.

New reminder: "{new_title}"

Existing reminders:
{existing_list}

Is the new reminder semantically similar or a duplicate of any existing reminder?
Two reminders are duplicates if they mean the same thing even if worded differently.
Example: "Pay electricity bill" and "pay light bill next month" are duplicates.

Return ONLY a valid JSON object, nothing else:
{{
  "is_duplicate": true or false,
  "matched_title": "the existing reminder it duplicates, or null if none"
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
        temperature=0.1
    )

    raw = response.choices[0].message.content.strip()
    return json.loads(raw)