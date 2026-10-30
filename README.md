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

## 👥 Team

- **Hackathon:** WebVision
- **Project:** DMRC ONE
- **AI assistant:** MetroMate AI
- **Team:** *Add team name and members*

## 📄 License

Developed as a hackathon prototype inspired by Delhi Metro passenger services. This project is not an official DMRC application.

---

*Making Delhi Metro information easier to find, understand, and use.*
