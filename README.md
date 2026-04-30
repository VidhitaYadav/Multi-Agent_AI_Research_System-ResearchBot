# Multi-Agent AI Research System - ResearchBot

A full-stack AI research assistant that turns a topic into a structured research report through a multi-agent pipeline. The system combines web search, webpage reading, report generation, and critique into a single chat-style experience.

## Live Demo

- Frontend: [https://multi-agent-ai-research-system-td58.onrender.com](https://multi-agent-ai-research-system-td58.onrender.com)
- Backend API: [https://multi-agent-ai-research-system.onrender.com](https://multi-agent-ai-research-system.onrender.com)

Note: The project is hosted on Render's free tier, so the first request may take a few seconds while the service wakes up.

## Overview

ResearchBot follows a multi-step agent workflow:

1. Search Agent finds recent information using Tavily.
2. Reader Agent selects and scrapes a relevant source.
3. Writer Agent drafts a structured research report.
4. Critic Agent reviews the report and returns feedback.

The result is a simple public demo that showcases agent orchestration, tool usage, prompt chaining, and full-stack deployment.

## Features

- Multi-agent research pipeline built with LangChain
- Tavily-powered web search for topic discovery
- Web scraping for deeper source extraction
- Structured research report generation
- Critic/reviewer stage for quality feedback
- React chat UI for end-user interaction
- FastAPI backend for orchestration and API serving
- Render deployment for both frontend and backend
- Basic public-demo safeguards:
  rate limiting and input length checks

## Architecture

```text
User -> React Frontend -> FastAPI Backend -> pipeline.py
                                      -> Search Agent -> Tavily Search
                                      -> Reader Agent -> URL Scraping
                                      -> Writer Chain -> Final Report
                                      -> Critic Chain -> Review Feedback
```

## Tech Stack

- Frontend: React, React Scripts
- Backend: FastAPI, Uvicorn, Pydantic
- AI Framework: LangChain
- LLM Provider: OpenAI or Mistral via OpenAI-compatible endpoint
- Search: Tavily
- Scraping: Requests, BeautifulSoup
- Deployment: Render

## Project Structure

```text
MultiAgentSystem_GenAI/
├── agents.py
├── pipeline.py
├── tools.py
├── requirements.txt
├── render.yaml
├── runtime.txt
├── research-ui/
│   ├── backend/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── .python-version
│   └── frontend/
│       ├── package.json
│       ├── public/
│       └── src/
└── README.md
```

## How It Works

### `pipeline.py`

Coordinates the full workflow:

- runs search
- sends search output to the reader agent
- combines findings for the writer
- sends the draft to the critic
- returns the final state object

### `agents.py`

Defines:

- search agent
- reader agent
- writer chain
- critic chain

The LLM is selected automatically:

- uses `OPENAI_API_KEY` if available
- otherwise uses `MISTRAL_API_KEY`

### `tools.py`

Provides the external tools:

- `web_search()` for Tavily search
- `scrape_url()` for webpage extraction

### `research-ui/backend/main.py`

FastAPI service that:

- exposes `/` health route
- exposes `/chat` for the frontend
- imports and runs `run_research_pipeline()`
- applies lightweight public-demo protections

### `research-ui/frontend`

React-based chat interface that:

- sends user prompts to the backend
- shows the generated report and critic feedback
- supports deployment via Render Static Site

## Environment Variables

Create a `.env` file in the project root:

```env
TAVILY_API_KEY=your_tavily_key

# Choose one LLM provider:
OPENAI_API_KEY=your_openai_key
# or
MISTRAL_API_KEY=your_mistral_key

# Optional model overrides
OPENAI_MODEL=gpt-4o-mini
MISTRAL_MODEL=mistral-small-latest
```

For frontend production deployment, set:

```env
REACT_APP_API_URL=https://multi-agent-ai-research-system.onrender.com
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/VidhitaYadav/Multi-Agent_AI_Research_System-ResearchBot.git
cd Multi-Agent_AI_Research_System-ResearchBot
```

### 2. Create and activate a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

```powershell
python -m pip install -r requirements.txt
python -m pip install -r research-ui\backend\requirements.txt
```

### 4. Start the backend

```powershell
cd research-ui
python -m uvicorn backend.main:app --reload --port 8000
```

### 5. Start the frontend

Open a new terminal:

```powershell
cd research-ui\frontend
npm install
npm start
```

### 6. Open the app

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend health check: [http://localhost:8000](http://localhost:8000)

## API

### `GET /`

Returns service health information.

### `POST /chat`

Request:

```json
{
  "message": "Suggest a GenAI research topic"
}
```

Response:

```json
{
  "reply": "Formatted research output...",
  "report": "Generated report...",
  "feedback": "Critic feedback..."
}
```

## Deployment

### Backend on Render

- Root Directory: `research-ui/backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Python Version: `3.11.11`

Required environment variables:

- `TAVILY_API_KEY`
- `OPENAI_API_KEY` or `MISTRAL_API_KEY`
- `PYTHON_VERSION=3.11.11`

### Frontend on Render

- Service Type: Static Site
- Root Directory: `research-ui/frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`

Required environment variable:

- `REACT_APP_API_URL=https://multi-agent-ai-research-system.onrender.com`

## Public Demo Safeguards

Because the project is publicly accessible and backed by paid API keys, the backend includes lightweight protections:

- maximum input length
- per-IP request throttling

These protections help preserve API quota while keeping the demo open for recruiters and reviewers.

## Limitations

- Tavily search quality depends on external web results
- Scraping may fail for sites with heavy anti-bot protections
- Render free tier can introduce cold-start delays
- The current rate limit is intentionally simple and in-memory, so it is best suited for demo usage

## Resume-Friendly Summary

Built and deployed a full-stack multi-agent AI research assistant using LangChain, FastAPI, React, Tavily, and LLM-based report generation. The system orchestrates search, reading, writing, and critique agents in a single workflow and is deployed live on Render.

## Future Improvements

- persistent caching for repeated queries
- source citation cards in the frontend
- stronger production-grade rate limiting
- authentication for private demos
- report export to PDF or DOCX

## Author

Vidhita Yadav

- GitHub: [https://github.com/VidhitaYadav](https://github.com/VidhitaYadav)
- Project Repository: [https://github.com/VidhitaYadav/Multi-Agent_AI_Research_System-ResearchBot](https://github.com/VidhitaYadav/Multi-Agent_AI_Research_System-ResearchBot)
