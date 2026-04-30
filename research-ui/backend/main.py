"""
FastAPI Backend for Multi-Agent Research System

Expected folder layout:
    MultiAgentSystem_GenAI/          <- PROJECT ROOT
        pipeline.py                  <- must be here
        agents.py
        tools.py
        .env
        research-ui/
            backend/
                main.py              <- THIS FILE
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import sys
import os

# ------------------------------------------------------------------------------
# PATH SETUP
# __file__  =  .../MultiAgentSystem_GenAI/research-ui/backend/main.py
# We need   =  .../MultiAgentSystem_GenAI/   (2 levels up from main.py)
# ------------------------------------------------------------------------------
THIS_FILE    = os.path.abspath(__file__)        # .../backend/main.py
BACKEND_DIR  = os.path.dirname(THIS_FILE)       # .../backend/
RESEARCH_UI  = os.path.dirname(BACKEND_DIR)     # .../research-ui/
PROJECT_ROOT = os.path.dirname(RESEARCH_UI)     # .../MultiAgentSystem_GenAI/

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Debug output visible in your uvicorn terminal
print("\n" + "=" * 60)
print("PATH DEBUG")
print(f"  main.py      : {THIS_FILE}")
print(f"  project root : {PROJECT_ROOT}")
pipeline_found = os.path.isfile(os.path.join(PROJECT_ROOT, "pipeline.py"))
print(f"  pipeline.py  : {'FOUND' if pipeline_found else 'NOT FOUND - check folder structure!'}")
print("=" * 60 + "\n")

# ------------------------------------------------------------------------------
# FastAPI app
# ------------------------------------------------------------------------------
app = FastAPI(title="Multi-Agent Research API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    report: str = ""
    feedback: str = ""


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Multi-Agent Research API is running",
        "pipeline_found": os.path.isfile(os.path.join(PROJECT_ROOT, "pipeline.py")),
        "project_root": PROJECT_ROOT,
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    topic = request.message.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        from pipeline import run_research_pipeline
        loop = asyncio.get_event_loop()
        state = await loop.run_in_executor(None, run_research_pipeline, topic)

        report   = state.get("report", "")
        feedback = state.get("feedback", "")

        reply = f"**Research Report: {topic}**\n\n{report}"
        if feedback:
            reply += f"\n\n---\n**Critic Feedback:**\n{feedback}"

        return ChatResponse(reply=reply, report=report, feedback=feedback)

    except ImportError as e:
        msg = (
            f"Could not import pipeline.py\n\n"
            f"**Error:** {str(e)}\n\n"
            f"**Expected location:** {PROJECT_ROOT}\\pipeline.py\n\n"
            f"Fix steps:\n"
            f"1. Make sure research-ui/ is directly inside MultiAgentSystem_GenAI/\n"
            f"2. Confirm pipeline.py exists in the project root\n"
            f"3. Install pipeline dependencies in the same venv"
        )
        return ChatResponse(reply=msg)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")