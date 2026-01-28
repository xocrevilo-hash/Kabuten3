"""
Kabuten Voice API - PersonaPlex Backend Integration

This FastAPI server provides a WebSocket endpoint for real-time voice
conversations about Japanese stocks using NVIDIA PersonaPlex.

Requirements:
    pip install fastapi uvicorn websockets torch

    # PersonaPlex dependencies
    pip install moshi accelerate

Usage:
    HF_TOKEN=your_token uvicorn voice_server:app --host 0.0.0.0 --port 8000 --ssl-keyfile key.pem --ssl-certfile cert.pem
"""

import os
import json
import asyncio
import logging
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================
# Configuration
# ============================================================================

class Config:
    """Server configuration"""

    # PersonaPlex settings
    VOICE_PROMPT = os.getenv("VOICE_PROMPT", "NATF2.pt")  # Natural female voice
    DEFAULT_TEXT_PROMPT = """You are Kabuten Assistant, a knowledgeable and friendly Japanese stock market research assistant.

Your role:
- Help users understand Japanese stocks and companies
- Provide insights on market sentiment and company fundamentals
- Answer questions clearly and concisely
- Be helpful but remind users to do their own research for investment decisions

Style:
- Speak naturally and conversationally
- Use simple language, avoid jargon unless asked
- Be concise - prefer short, clear answers
- Show enthusiasm about interesting market developments
"""

    # Audio settings
    SAMPLE_RATE = 24000
    CHUNK_SIZE = 4800  # 200ms chunks

    # WebSocket settings
    PING_INTERVAL = 30
    PING_TIMEOUT = 10

config = Config()


# ============================================================================
# PersonaPlex Integration
# ============================================================================

class PersonaPlexManager:
    """Manages PersonaPlex model loading and inference"""

    def __init__(self):
        self.model = None
        self.voice_prompts = {}
        self._lock = asyncio.Lock()

    async def initialize(self):
        """Load PersonaPlex model and voice prompts"""
        logger.info("Initializing PersonaPlex...")

        try:
            # Import PersonaPlex modules
            from moshi.models import Moshi
            from moshi.tokenizer import MimiTokenizer

            # Load model (will use CPU offload if needed)
            self.model = Moshi.from_pretrained(
                "nvidia/personaplex-7b-v1",
                use_auth_token=os.getenv("HF_TOKEN")
            )

            # Load voice prompts
            voice_files = ["NATF0", "NATF1", "NATF2", "NATF3",
                          "NATM0", "NATM1", "NATM2", "NATM3"]

            for voice in voice_files:
                try:
                    # Load pre-packaged voice embeddings
                    self.voice_prompts[voice] = self.model.load_voice_prompt(f"{voice}.pt")
                except Exception as e:
                    logger.warning(f"Failed to load voice prompt {voice}: {e}")

            logger.info(f"PersonaPlex initialized with {len(self.voice_prompts)} voices")

        except ImportError:
            logger.warning("PersonaPlex not installed - using mock mode")
            self.model = None
        except Exception as e:
            logger.error(f"Failed to initialize PersonaPlex: {e}")
            self.model = None

    async def process_audio(
        self,
        audio_chunks: list,
        text_prompt: str,
        voice_prompt: str = "NATF2"
    ):
        """
        Process audio input and generate response

        Args:
            audio_chunks: List of audio data (bytes)
            text_prompt: System/context prompt
            voice_prompt: Voice to use for response

        Yields:
            Audio chunks of the response
        """
        if self.model is None:
            # Mock mode for testing
            yield await self._mock_response()
            return

        async with self._lock:
            try:
                # Combine audio chunks
                audio_data = b''.join(audio_chunks)

                # Get voice embedding
                voice_emb = self.voice_prompts.get(voice_prompt)
                if voice_emb is None:
                    voice_emb = self.voice_prompts.get("NATF2")

                # Run PersonaPlex inference
                response_generator = self.model.generate(
                    audio=audio_data,
                    text_prompt=text_prompt,
                    voice_prompt=voice_emb,
                    max_duration=30.0,  # Max response duration
                    stream=True
                )

                async for audio_chunk, text_chunk in response_generator:
                    yield {
                        "audio": audio_chunk,
                        "text": text_chunk
                    }

            except Exception as e:
                logger.error(f"PersonaPlex inference error: {e}")
                raise

    async def _mock_response(self) -> dict:
        """Generate mock response for testing without PersonaPlex"""
        await asyncio.sleep(1)  # Simulate processing
        return {
            "audio": b"",  # Would be actual audio bytes
            "text": "I'm running in mock mode. PersonaPlex is not installed."
        }


# Global PersonaPlex manager
persona_plex = PersonaPlexManager()


# ============================================================================
# Kabuten Data Integration
# ============================================================================

def build_context_prompt(context: Optional[Dict[str, Any]] = None) -> str:
    """
    Build PersonaPlex text prompt with Kabuten context

    Args:
        context: Optional context data (company, ticker, etc.)

    Returns:
        Full text prompt for PersonaPlex
    """
    base_prompt = config.DEFAULT_TEXT_PROMPT

    if not context:
        return base_prompt

    # Add company-specific context
    context_parts = []

    if "company" in context:
        company = context["company"]
        context_parts.append(f"\nCurrent context - User is viewing {company.get('name', 'Unknown Company')}:")

        if "ticker" in company:
            context_parts.append(f"- Ticker: {company['ticker']}")

        if "outlook" in company:
            context_parts.append(f"- Investment Outlook: {company['outlook']}")

        if "summary" in company:
            context_parts.append(f"- Summary: {company['summary']}")

        if "sentiment" in company:
            sentiment = company["sentiment"]
            context_parts.append(f"- Social Sentiment: {sentiment.get('positive', 0)}% positive")

        if "price" in company:
            price = company["price"]
            context_parts.append(f"- Current Price: ¥{price.get('current', 'N/A')}")

    if context_parts:
        return base_prompt + "\n" + "\n".join(context_parts)

    return base_prompt


# ============================================================================
# FastAPI Application
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup
    await persona_plex.initialize()
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Kabuten Voice API",
    description="Voice assistant API for Kabuten Japanese stock research",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://kabuten.com",
        "https://www.kabuten.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "persona_plex_loaded": persona_plex.model is not None
    }


@app.websocket("/voice")
async def voice_endpoint(
    websocket: WebSocket,
    context: Optional[str] = Query(None, description="JSON-encoded context data")
):
    """
    WebSocket endpoint for real-time voice conversations

    Protocol:
    - Client sends binary audio chunks while user is speaking
    - Client sends JSON {"type": "end_speech"} when user stops
    - Server sends JSON messages for events (transcript, response_text, etc.)
    - Server sends binary audio chunks for voice response
    """
    await websocket.accept()
    logger.info("Voice WebSocket connected")

    # Parse context if provided
    context_data = None
    if context:
        try:
            context_data = json.loads(context)
        except json.JSONDecodeError:
            logger.warning("Invalid context JSON, ignoring")

    # Build prompt with context
    text_prompt = build_context_prompt(context_data)

    audio_chunks = []

    try:
        while True:
            # Receive message (binary audio or JSON control)
            message = await websocket.receive()

            if "bytes" in message:
                # Audio data chunk
                audio_chunks.append(message["bytes"])

            elif "text" in message:
                # Control message
                try:
                    control = json.loads(message["text"])

                    if control.get("type") == "end_speech":
                        # User finished speaking - process and respond

                        if not audio_chunks:
                            await websocket.send_json({
                                "type": "error",
                                "message": "No audio received"
                            })
                            continue

                        # Signal processing start
                        await websocket.send_json({"type": "processing_start"})

                        # Process with PersonaPlex
                        try:
                            full_text = ""

                            async for response in persona_plex.process_audio(
                                audio_chunks,
                                text_prompt,
                                voice_prompt=config.VOICE_PROMPT
                            ):
                                # Send audio chunk
                                if response.get("audio"):
                                    await websocket.send_bytes(response["audio"])

                                # Accumulate text
                                if response.get("text"):
                                    full_text += response["text"]

                                    # Send response start on first chunk
                                    if len(full_text) == len(response["text"]):
                                        await websocket.send_json({
                                            "type": "response_start"
                                        })

                            # Send complete response text
                            await websocket.send_json({
                                "type": "response_text",
                                "text": full_text
                            })

                            # Signal response end
                            await websocket.send_json({"type": "response_end"})

                        except Exception as e:
                            logger.error(f"Processing error: {e}")
                            await websocket.send_json({
                                "type": "error",
                                "message": "Failed to process audio"
                            })

                        # Reset for next interaction
                        audio_chunks = []

                    elif control.get("type") == "update_context":
                        # Update context mid-conversation
                        new_context = control.get("context")
                        if new_context:
                            text_prompt = build_context_prompt(new_context)
                            await websocket.send_json({
                                "type": "context_updated"
                            })

                    elif control.get("type") == "ping":
                        await websocket.send_json({"type": "pong"})

                except json.JSONDecodeError:
                    logger.warning("Invalid JSON control message")

    except WebSocketDisconnect:
        logger.info("Voice WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.close(code=1011, reason=str(e))
        except:
            pass


# ============================================================================
# CLI Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    # Generate self-signed cert for local development
    import subprocess
    import tempfile

    ssl_dir = tempfile.mkdtemp()
    key_file = f"{ssl_dir}/key.pem"
    cert_file = f"{ssl_dir}/cert.pem"

    subprocess.run([
        "openssl", "req", "-x509", "-newkey", "rsa:4096",
        "-keyout", key_file, "-out", cert_file,
        "-days", "365", "-nodes",
        "-subj", "/CN=localhost"
    ], check=True)

    logger.info(f"Starting server with SSL cert in {ssl_dir}")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        ssl_keyfile=key_file,
        ssl_certfile=cert_file
    )
