# WebVision Hackathon Project

### 🚇 DMRC AI Chatbot & Voicebot
Making Delhi Metro easier to navigate, one conversation at a time.

## 📌 Problem Statement

Delhi Metro is used by thousands of people every day, but finding the right route, checking fares, understanding interchanges, and locating station facilities can still be confusing, especially for first-time travellers and tourists.

Not everyone wants to navigate a metro map or search through different websites just to get a simple answer. For some passengers, being able to ask a question in their own language or through voice would make the experience much easier.

The challenge is to build a smart, easy-to-use assistant that helps passengers get the metro information they need through simple conversations, whether they prefer typing or speaking.

## 💡 Our Solution

We're building an AI-powered chatbot and voicebot for DMRC that makes getting around Delhi Metro as simple as asking a question.

Whether someone wants to know how to reach a station, check the fare for their journey, find an interchange, or learn about station facilities, they can simply ask the assistant and get a clear answer.

The assistant will support English, Hindi, and Hinglish, allowing people to communicate naturally instead of having to phrase every query in a specific way.

By combining AI with actual metro data and route-planning algorithms, we aim to make the experience helpful, reliable, and accessible to everyone.

## ✨ What We're Building

- **🗺️ Smart Route Planning** — Find routes between metro stations, with information about line changes, interchanges, and estimated travel time.
- **🎙️ Voice-Based Assistance** — Ask questions out loud and get spoken responses instead of having to type everything.
- **🌐 Hindi, English & Hinglish** — Communicate in the language you're most comfortable with.
- **🎫 Fare Information** — Check metro fares for your journey using verified fare data.
- **🚉 Station Guide** — Get information about station exits, facilities, and nearby landmarks wherever reliable data is available.
- **💬 Natural Follow-Up Questions** — Ask things like "What about the fare?" or "Is there another route?" without explaining your entire journey again.
- **♿ Accessibility in Mind** — Make metro information easier to access through voice interactions and a simple, readable interface.

## ⚙️ How It Works

1. **Ask a question:** Type your query or speak directly to the assistant.
2. **Understand the request:** The system identifies what you're looking for, whether it's a route, fare, or station information.
3. **Find the right information:** It uses structured metro data and the appropriate service to retrieve an answer.
4. **Get your answer:** The assistant explains the information in a simple, conversational way.
5. **Listen if you prefer:** In voice mode, the answer is also spoken aloud.

The goal is to make the whole process feel like talking to someone who knows their way around Delhi Metro.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Python (FastAPI) or Node.js |
| AI | LLM with tool calling |
| Route Planning | Graph algorithms (Dijkstra's algorithm) |
| Database | PostgreSQL / Supabase |
| Speech Recognition | Web Speech API or a multilingual speech model |
| Voice Responses | Speech Synthesis API or a multilingual TTS service |
| Deployment | Vercel and backend hosting |

*The final stack will depend on our implementation and the APIs available to us.*

## 🏗️ How the System Fits Together

```text
          User
           |
     Chat / Voice UI
           |
     Speech-to-Text
           |
      AI Assistant
           |
    +------+------+------+
    |             |      |
 Route Planner  Fare   Station
                Data   Information
    |             |      |
    +------+------+------+
           |
     Clear Response
           |
      Text / Voice
           |
          User
```

The AI handles the conversation, while dedicated services handle route calculations and information retrieval. This helps us keep responses useful without relying on AI to guess important travel details.

## 🎯 Why This Matters

We want to make everyday metro travel a little less confusing and a lot more convenient.

Our goal is to help commuters spend less time figuring out routes and searching for information, while making the experience more welcoming for tourists, first-time travellers, and people who find traditional interfaces difficult to use.

A simple question should have a simple answer, whether it's typed in English, asked in Hindi, or spoken in Hinglish.

## 🔮 What's Next?

As the project develops, we'd like to explore:

- Live metro service updates and disruption-aware route suggestions.
- Support for more Indian languages.
- Better route recommendations based on travel time and interchanges.
- More detailed station information and accessibility facilities.
- Integration with official DMRC passenger services, wherever supported.

## 👥 Team

- **Hackathon:** WebVision
- **Project:** DMRC AI Chatbot & Voicebot
- **Team Name:** *Honey Beez*

---

*Making metro travel simpler through conversations, not complications.*
