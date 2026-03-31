# 🎓 School Admission Voice AI Agent — Bolna FSE Assignment

**Built by:** Manvi Jaglan 

---

## 🎯 Problem Statement

During admission season (April–May), a school receives **100+ inbound calls daily**.  
Staff repeatedly answers the same 5 questions — fees, dates, grades, seats, callbacks.  
Calls go unanswered, leads are lost, and there's no system to track who called or what they need.

**Outcome metric:** If 60% of calls are handled by the agent, the school saves **3–4 staff hours daily** and captures **100% of leads** vs ~40% today.

---

## ✅ What I Built

### 1. Bolna Voice Agent
- Bilingual (English + Hindi)
- Handles FAQs: fees, grades, admission dates
- Collects: child name, grade, parent name, phone, callback time
- Books callbacks and confirms details before ending
- Fires webhook to backend after every call

### 2. FastAPI Backend (deployed on Render)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook` | Receives Bolna call data, saves to MongoDB |
| GET | `/enquiries` | Fetches all leads for dashboard |
| PATCH | `/enquiries/{id}` | Updates lead status |
| DELETE | `/enquiries/{id}` | Deletes a lead |

### 3. React Dashboard (deployed on Vercel)
- Live dashboard with **auto-refresh every 30 seconds**
- 3 pages: Dashboard, Call Logs, Analytics
- Status workflow: Pending → Callback Requested → Contacted
- Search, filter by status, manual lead entry
- Dark mode + bilingual labels (English/Hindi)

---

## 🔗 Live Links

| Resource | URL |
|----------|-----|
| 🌐 Dashboard (Vercel) | https://bolna-admission-assistant-git-main-manvibuilds-projects.vercel.app/ |
| ⚙️ Backend API (Render) | https://bolna-admission-assistant.onrender.com/ |
| 📡 Enquiries Endpoint | https://bolna-admission-assistant.onrender.com/enquiries |
| 💻 GitHub Repo | https://github.com/manvibuilds/bolna-admission-assistant |

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Voice Agent | Bolna |
| Backend | FastAPI + Python |
| Database | MongoDB Atlas |
| Frontend | React + Vite + Tailwind CSS |
| Backend Deploy | Render |
| Frontend Deploy | Vercel |

---

## 📁 Project Structure

```
bolna-admission-assistant/
├── backend/
│   ├── main.py              # FastAPI + webhook + MongoDB
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── api.js            # Points to Render backend
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── CallLogs.jsx
    │   │   └── Analytics.jsx
    │   └── components/
    │       ├── StatusBadge.jsx
    │       └── AddLeadModal.jsx
    ├── index.html
    ├── package.json
    └── vercel.json           # SPA routing fix
```

---

## 🚀 Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # add your MONGO_URI
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env        # add VITE_API_URL
npm run dev
```

---

## ⚠️ Production Note

This project is **production-ready**. To go fully live:
1. Purchase an inbound phone number from Bolna
2. Attach it to the agent
3. Add the number to the school's website
---

## 🔄 Full Flow

```
Parent calls → Bolna Agent answers
    → Collects: child name, grade, parent name, phone
    → Answers: fees, dates, seat availability
    → Books callback if needed
    → Webhook fires to FastAPI /webhook
    → Data saved in MongoDB Atlas
    → React dashboard shows lead in real time
    → Admin updates status: Pending → Contacted
```

---

## 🌟 Real-World Context

I'm currently building a chatbot for a School that handles ERP flows — admissions, fee queries, attendance — for real school operations. While exploring voice AI for that project, I tried Bharat Voice, WebRTC, and other solutions. When I explored Bolna for this assignment, it was genuinely the best experience — structured, fast, and production-ready.
