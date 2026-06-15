# 📅 Reminder App

A full-stack reminder management app to help you stay on top of what matters.

## 🚀 Live Demo

https://reminder-ui-tau.vercel.app

## 🔁 CI Status

![CI](https://github.com/Aiswarya-Pokharel/reminder-ui/actions/workflows/reminder_workflow.yml/badge.svg)

---

## 🛠 Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | React, Vite, Tailwind CSS, React Router |
| Backend    | Django, Django REST Framework           |
| Database   | PostgreSQL                              |
| Deployment | Vercel (Frontend), Render (Backend)     |
| CI/CD      | GitHub Actions                          |
| Container  | Docker, Docker Compose                  |

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
├── .github/
│   └── workflows/
│       └── reminder_workflow.yml  # GitHub Actions CI
├── frontend/                      # React + Vite app
│   ├── Dockerfile
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
└── backend/                       # Django REST API
    ├── Dockerfile
    ├── reminder/
    │   ├── models.py
    │   ├── views.py
    │   ├── serializers.py
    │   └── urls.py
    ├── manage.py
    └── requirements.txt
├── docker-compose.yml
├── .env.example
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

## 🐳 Run with Docker

### Prerequisites

- Docker Desktop installed

### Steps

```bash
# 1. Copy env file and fill in values
cp .env.example backend/.env

# 2. Build and start all services
docker compose up --build

# 3. Run migrations (first time only)
docker compose exec backend python manage.py migrate

# 4. Create admin user (first time only)
docker compose exec backend python manage.py createsuperuser
```

### Services

| Service  | URL                         |
| -------- | --------------------------- |
| Frontend | http://localhost:5173       |
| Backend  | http://localhost:8000       |
| Admin    | http://localhost:8000/admin |

### Stop Docker

```bash
docker compose down
```

---

## ⚙️ GitHub Actions CI

This project uses GitHub Actions for continuous integration on every push:

- ✅ Installs Python dependencies
- ✅ Runs Django tests with SQLite
- ✅ Installs Node dependencies
- ✅ Builds React frontend

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
- **Backend** → Render

---

## 👩‍💻 Author

**Aiswarya Pokharel**  
[GitHub](https://github.com/Aiswarya-Pokharel)
