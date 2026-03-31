# 🎓 Delhi Model School — Admission Voice Agent Dashboard

Full-stack project for Bolna FSE Assignment.

**Flow:** Parent calls → Bolna Voice Agent → webhook → FastAPI → MongoDB → React Dashboard

---

## Project Structure

```
bolna-admission-assistant/
├── backend/
│   ├── main.py            ← FastAPI + webhook + MongoDB
│   ├── requirements.txt
│   └── .env.example       ← copy to .env with your MONGO_URI
└── frontend/
    ├── src/
    │   ├── main.jsx        ← entry point
    │   ├── index.css       ← Tailwind + custom classes
    │   ├── App.jsx         ← layout + routing
    │   ├── api.js          ← API calls to backend
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── CallLogs.jsx
    │   │   └── Analytics.jsx
    │   └── components/
    │       ├── StatusBadge.jsx
    │       └── AddLeadModal.jsx
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── vercel.json         ← SPA routing fix for Vercel
```

---

## Step 1 — MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **Connect** on Cluster0
3. Choose **Drivers** → Python → Copy the connection string
4. Replace `<password>` with your actual password
5. Save it — you'll need it for Render

---

## Step 2 — Deploy Backend to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add **Environment Variable:**
   - Key: `MONGO_URI`
   - Value: your MongoDB Atlas connection string
6. Deploy → copy the URL (e.g. `https://admission-backend-xxxx.onrender.com`)

---

## Step 3 — Add Webhook URL to Bolna

1. Go to [platform.bolna.ai](https://platform.bolna.ai)
2. Open **School Admission Assistant** → **Tools** tab
3. Find `save_admission_lead` function
4. Set the URL to: `https://your-render-url.onrender.com/webhook`
5. Save the agent

---

## Step 4 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add **Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: your Render backend URL
4. Deploy → get your Vercel URL

---

## Step 5 — Test the Full Flow

1. Open your Vercel dashboard
2. On Bolna platform → click **"Get call from agent"** (or use test chat)
3. Talk through the admission flow
4. Watch the lead appear on your dashboard in real-time (auto-refreshes every 30s)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook` | Receives call data from Bolna |
| GET | `/enquiries` | Returns all leads for dashboard |
| PATCH | `/enquiries/{id}` | Update lead status |
| DELETE | `/enquiries/{id}` | Delete a lead |

---

## Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # add your MONGO_URI
uvicorn main:app --reload
# Runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:8000
npm run dev
# Runs on http://localhost:5173
```
