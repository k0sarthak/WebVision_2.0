"""
AI Assistant Endpoints (MetroMate AI)
"""

from fastapi import APIRouter
from app.schemas.schemas import ChatRequest, VoiceQueryRequest
from app.ai.assistant import metromate_ai

router = APIRouter(prefix="/assistant", tags=["MetroMate AI"])

@router.post("/chat")
def chat_with_assistant(req: ChatRequest):
    return metromate_ai.process_query(query=req.message, language=req.language or "en")

@router.post("/voice-query")
def process_voice_query(req: VoiceQueryRequest):
    return metromate_ai.process_query(query=req.transcript, language=req.language or "en")

