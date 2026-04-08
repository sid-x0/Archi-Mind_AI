import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.chat import router as chat_router
from routes.building import router as building_router

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(name)s  %(message)s")

app = FastAPI(
    title="AI Architect Assistant — MCP Backend",
    description="FastAPI backend implementing the MCP orchestration pattern for an AI-driven building planner.",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow the Vite dev server and any production origin
_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(chat_router, prefix="/api", tags=["chat"])
app.include_router(building_router, prefix="/api", tags=["building"])


@app.get("/", tags=["health"])
async def root():
    gemini_ready = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "ok",
        "service": "AI Architect Assistant",
        "gemini": "configured" if gemini_ready else "missing — using keyword fallback",
    }


@app.get("/health", tags=["health"])
async def health():
    return {"status": "healthy"}
