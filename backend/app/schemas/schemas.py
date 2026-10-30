"""
Pydantic Schemas for DMRC ONE API
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class RouteRequest(BaseModel):
    source: str = Field(..., description="Starting station name or ID", example="Kashmere Gate")
    destination: str = Field(..., description="Destination station name or ID", example="Rajiv Chowk")
    preference: Optional[str] = Field("fastest", description="Route preference: fastest, min_interchanges, or accessible")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message or query", example="How can I reach India Gate from Rajiv Chowk?")
    language: Optional[str] = Field("en", description="Preferred response language: en or hi")

class VoiceQueryRequest(BaseModel):
    transcript: str = Field(..., description="Speech-to-text converted transcript", example="Mujhe Rajiv Chowk se Kashmere Gate jaana hai")
    language: Optional[str] = Field("en", description="Spoken language code (e.g., en-IN, hi-IN)")

