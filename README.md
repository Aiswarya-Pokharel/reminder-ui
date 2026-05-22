# 📅 Reminder App

A full-stack reminder management app to help you stay on top of what matters.

## 🚀 Live Demo

https://reminder-ui-tau.vercel.app

---

## 🛠 Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | React, Vite, Tailwind CSS, React Router |
| Backend    | Django, Django REST Framework           |
| Database   | SQLite                                  |
| Deployment | Vercel (Frontend) , Render (backend)    |

---

## ✨ Features

- ➕ Create reminders with title, description, date, time, and priority
- 📋 View all reminders in a clean, minimal list
- ✏️ Edit reminders inline
- 🗑️ Delete reminders with confirmation
- 🔴🟡🟢 Priority levels — High, Medium, Low
- ✅ Form validation with error messages
- 📱 Responsive design

---

## 📁 Project Structure

```plaintext
reminder_api/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── Components/
│   │   │  ├── ReminderForm.jsx
│   │   │  └── ReminderList.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vercel.json
│   └── package.json
│
└── backend/                   # Django REST API
    ├── reminder/
    │   ├── models.py
    │   ├── views.py
    │   ├── serializers.py
    │   └── urls.py
    ├── manage.py
    └── requirements.txt
```

---

## 🔧 Run Locally

### Prerequisites

- npm
- Python 3.x

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## 🌐 API Endpoints

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/api/reminders/`      | Get all reminders |
| POST   | `/api/reminders/`      | Create a reminder |
| PUT    | `/api/reminders/{id}/` | Update a reminder |
| DELETE | `/api/reminders/{id}/` | Delete a reminder |

---

## 🚢 Deployment

- **Frontend** → Vercel

---

## 👩‍💻 Author

**Aiswarya Pokharel**  
[GitHub](https://github.com/Aiswarya-Pokharel)
