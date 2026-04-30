# Multi-Agent AI Research System - ResearchBot

A full-stack AI research assistant that turns a topic into a structured research report through a multi-agent pipeline. The system combines web search, webpage reading, report generation, and critique into a single chat-style experience.

## Live Demo
[https://multi-agent-ai-research-system-td58.onrender.com](https://multi-agent-ai-research-system-td58.onrender.com)

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

## Public Demo Safeguards

Because the project is publicly accessible and backed by paid API keys, the backend includes lightweight protections:

- maximum input length
- per-IP request throttling

These protections help preserve API quota while keeping the demo open for reviewers.

## Limitations

- Tavily search quality depends on external web results
- Scraping may fail for sites with heavy anti-bot protections
- Render free tier can introduce cold-start delays
- The current rate limit is intentionally simple and in-memory, so it is best suited for demo usage


## Future Improvements

- persistent caching for repeated queries
- source citation cards in the frontend
- stronger production-grade rate limiting
- authentication for private demos
- report export to PDF or DOCX

## Author

Vidhita Yadav

(https://github.com/VidhitaYadav/Multi-Agent_AI_Research_System-ResearchBot)
