from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Delhi Model School - Admission API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["admission_db"]
enquiries = db["enquiries"]


# ── Models ──────────────────────────────────────────────

class WebhookPayload(BaseModel):
    child_name: Optional[str] = ""
    grade: Optional[str] = ""
    parent_name: Optional[str] = ""
    phone_number: Optional[str] = ""
    callback_requested: Optional[str] = "no"
    callback_time: Optional[str] = ""
    query_summary: Optional[str] = ""

class StatusUpdate(BaseModel):
    status: str


# ── Helper ───────────────────────────────────────────────

def serialize(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


# ── Routes ───────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "Delhi Model School Admission API is running"}


@app.post("/webhook")
def receive_webhook(payload: WebhookPayload):
    """
    Receives call data from Bolna after each admission enquiry call.
    Saves to MongoDB with timestamp and default Pending status.
    """
    doc = {
        "child_name": payload.child_name,
        "grade": payload.grade,
        "parent_name": payload.parent_name,
        "phone_number": payload.phone_number,
        "callback_requested": payload.callback_requested,
        "callback_time": payload.callback_time,
        "query_summary": payload.query_summary,
        "status": "Pending",
        "created_at": datetime.utcnow().isoformat(),
        "date": datetime.now().strftime("%d %b %Y"),
        "time": datetime.now().strftime("%I:%M %p"),
    }
    result = enquiries.insert_one(doc)
    return {
        "success": True,
        "message": "Enquiry saved",
        "id": str(result.inserted_id)
    }


@app.get("/enquiries")
def get_enquiries():
    """
    Returns all admission enquiries sorted by newest first.
    Called by the React dashboard every 30 seconds.
    """
    docs = list(enquiries.find().sort("created_at", -1))
    return {
        "success": True,
        "count": len(docs),
        "enquiries": [serialize(d) for d in docs]
    }


@app.patch("/enquiries/{enquiry_id}")
def update_status(enquiry_id: str, body: StatusUpdate):
    """
    Update the status of a lead: Pending → Callback Requested → Contacted
    """
    result = enquiries.update_one(
        {"_id": ObjectId(enquiry_id)},
        {"$set": {"status": body.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"success": True, "status": body.status}


@app.delete("/enquiries/{enquiry_id}")
def delete_enquiry(enquiry_id: str):
    enquiries.delete_one({"_id": ObjectId(enquiry_id)})
    return {"success": True}
