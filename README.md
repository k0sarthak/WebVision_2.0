<<<<<<< HEAD
# DMRC ONE — Unified Delhi Metro Digital Experience 🚇

> **One Network. One Experience. Smarter Journeys.**

DMRC ONE is our WebVision hackathon project: one place to plan a Delhi Metro journey, explore stations, check metro information, and get help from **MetroMate AI**. We're bringing these everyday tasks into a single, accessible interface instead of making passengers move between different services and pages.

## 🌟 The Problem

Passengers may need to check several sources to plan a route, understand interchanges, find station facilities, look up ticketing guidance, or get travel updates. That can be frustrating for daily commuters and particularly confusing for tourists and people using the metro for the first time.

## 💡 Our Solution

DMRC ONE brings journey planning, an interactive metro map, station information, ticketing guidance, tourist destinations, and an AI travel assistant together in one web application.

MetroMate AI lets users ask travel questions in natural language. It can use backend tools to find stations, calculate routes, and retrieve available station or service information. Voice input and spoken responses are supported through browser speech APIs where available, with typing always available as a fallback.

The aim is simple: make Delhi Metro information easier to find, understand, and use.

## ✨ Features

### 1. Smart Journey Planner
- Calculates routes on a weighted metro-network graph using **Dijkstra's algorithm**.
- Accounts for line changes and configured interchange penalties.
- Supports fastest-route, minimum-interchange, and wheelchair/lift-accessibility preferences.
- Shows step-by-step directions, line changes, station counts, and estimated journey duration.
- Includes fare estimates based on the fare data configured in the project.

### 2. Interactive Metro Map
- Zoom and pan around a schematic SVG network map.
- Explore colour-coded metro corridors and interchange stations.
- Select stations to view available information.
- Highlight a calculated route on the map.

### 3. MetroMate AI
MetroMate AI uses a tool-calling design so travel questions can be handled by dedicated backend functions instead of relying on the language model to make up transit details.

Available tools include:
- `find_station` — find stations by name, code, landmark, or line.
- `calculate_route` — calculate a route using the route engine.
- `get_station_details` — retrieve available station and facility information.
- `get_metro_line_status` — retrieve configured line-status information.
- `get_estimated_fare` — calculate a fare using the project's configured fare data.
- `get_nearby_landmarks` — find station associations for supported landmarks.

The assistant can use a configured Gemini/OpenAI integration or the project's deterministic offline mode, depending on the implementation and environment.

### 4. Hindi and English Voice Assistant
- Voice input using the browser's Web Speech API where supported.
- English (`en-IN`) and Hindi (`hi-IN`) recognition settings.
- Spoken answers through the browser's Speech Synthesis API.
- Controls for playing, pausing, or replaying spoken responses where implemented.
- Text chat remains available if voice features aren't supported by the browser.

### 5. Metro Status Dashboard
- Displays configured status information for metro corridors.
- Includes status labels, refresh behaviour, and last-updated information.
- Uses a clear **DEMO DATA** label for simulated status; it should not be mistaken for verified live DMRC operations data.

### 6. Station Explorer and Accessibility Information
- Search and filter the station directory.
- Explore available details about interchanges, exits, lifts, escalators, parking, and other facilities.
- Distinguish verified details from sample or demo information where verification data is available.

### 7. Ticketing Hub
- Provides guidance about QR tickets, smart cards, NCMC, recharge, and ticketing options.
- Includes fare information supported by the configured dataset.
- This hackathon prototype does **not** process real payments or issue live tickets.

### 8. Tourist Mode
- Explore popular Delhi destinations, including India Gate, Red Fort, Qutub Minar, Lotus Temple, Akshardham, Connaught Place, Chandni Chowk, Humayun's Tomb, and Dilli Haat.
- View associated metro stations and available destination details.
- Start journey planning from a selected destination.

### 9. Accessibility-First Light Theme
- A consistent light-theme interface.
- Accessibility controls for text sizing, enhanced contrast, and reduced motion.
- Keyboard-friendly interactions and screen-reader-oriented labels where implemented.

> **Data note:** Route results depend on the metro network dataset bundled/configured for the project. Fare, facility, landmark, and status information should be treated as verified only when backed by a reliable source. Demo or simulated information should be labelled clearly.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS, Lucide React, Vite |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| Route planning | Dijkstra's shortest-path algorithm on a bidirectional graph |
| AI assistant | LLM tool calling (Gemini/OpenAI, or deterministic offline mode) |
| Voice input/output | Web Speech API and Speech Synthesis API |
| Database preparation | PostgreSQL / Supabase schema and seed scripts in `backend/sql/` |

## 📁 Project Structure

```text
dmrc-one/
├── backend/
│   ├── app/
│   │   ├── algorithms/
│   │   │   └── dijkstra.py
│   │   ├── ai/
│   │   │   ├── tools.py
│   │   │   └── assistant.py
│   │   ├── api/
│   │   │   └── endpoints/
│   │   ├── data/
│   │   │   └── delhi_metro_data.py
│   │   ├── services/
│   │   │   └── fare_service.py
│   │   ├── schemas/
│   │   └── main.py
│   ├── sql/
│   │   ├── schema.sql
│   │   └── seed_data.sql
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

Some filenames and folders may change as development continues; use the repository itself as the source of truth.

## 🚀 Local Setup

### Prerequisites
- Node.js and npm
- Python 3.10 or later (use a version compatible with the packages in `backend/requirements.txt`)
- Git

### 1. Start the backend

From the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If you're using Command Prompt instead of PowerShell, activate with:

```bat
.venv\Scripts\activate.bat
```

If the project requires environment variables, copy `backend/.env.example` to `backend/.env` and fill in the values locally. Do not commit real keys or credentials.

Start FastAPI:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

When running, the backend should be available at:
- API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health` (if enabled in the current backend)

### 2. Start the frontend

Open a second terminal at the project root:

```powershell
cd frontend
npm install
npm run dev
```

Vite will print the local development URL, typically `http://127.0.0.1:5173`.

## 🧪 Hackathon Demo Scenarios

Use these scenarios to demonstrate the main flows. Exact results depend on the dataset and current implementation.

1. **Journey planning:** Enter Kashmere Gate and Rajiv Chowk and inspect the calculated route, line, duration, and fare estimate.
2. **MetroMate AI:** Ask, “How can I reach India Gate from Rajiv Chowk?” and check whether the assistant calls the landmark and route tools.
3. **Hindi voice interaction:** Try “Mujhe New Delhi station se Chandni Chowk jaana hai.” If browser speech recognition is unavailable, type the same query.
4. **Accessibility directory:** Filter stations by wheelchair or lift accessibility and check the available facility information.
5. **Tourist Mode:** Select a destination such as Red Fort and start route planning.
6. **Metro status:** Open the status dashboard and confirm simulated information is clearly marked as demo data.

## 🔐 Security and Reliability

- Keep API keys and database credentials out of frontend code and Git history.
- Use environment variables for local secrets.
- Validate backend inputs and handle unavailable services gracefully.
- Don't present simulated metro status as live operational data.
- Don't claim a facility, fare, or route detail is official unless the data source supports that claim.
- Don't use this prototype for real ticket purchases or payments.

## 🗺️ Future Improvements

- Connect additional verified official DMRC information sources where access is available.
- Expand station, facility, and fare datasets.
- Improve multilingual conversation handling.
- Add more route preferences and testing for edge cases.
- Deploy the frontend and FastAPI backend for a public demo.
=======
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
>>>>>>> 37967c581a79fd01e722c75a8f517488a1bcb97a

## 👥 Team

- **Hackathon:** WebVision
<<<<<<< HEAD
- **Project:** DMRC ONE
- **AI assistant:** MetroMate AI
- **Team:** *Add team name and members*

## 📄 License

Developed as a hackathon prototype inspired by Delhi Metro passenger services. This project is not an official DMRC application.

---

*Making Delhi Metro information easier to find, understand, and use.*
=======
- **Project:** DMRC AI Chatbot & Voicebot
- **Team Name:** *Honey Beez*

---

*Making metro travel simpler through conversations, not complications.*
>>>>>>> 37967c581a79fd01e722c75a8f517488a1bcb97a
