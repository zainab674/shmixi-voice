

from dotenv import load_dotenv
load_dotenv()

import json
import asyncio
from typing import Optional

from livekit import agents, rtc
from livekit.agents import AgentSession, Agent, function_tool
from livekit.plugins import groq, deepgram


class ProductDetectingSession(AgentSession):
    """Custom session that intercepts transcripts and triggers product functions"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.product_assistant = None
    
    def set_product_assistant(self, assistant):
        """Set the assistant reference"""
        self.product_assistant = assistant
    
    async def _handle_user_transcript(self, transcript: str):
        """Override transcript handling to detect product requests"""
        print(f"[agent] 🎤 Intercepted transcript: '{transcript}'")
        
        # Check for product requests first
        if self.product_assistant:
            handled = await self.product_assistant.handle_product_request(transcript)
            if handled:
                print(f"[agent] ✅ Product request handled, skipping normal LLM processing")
                return  # Skip normal processing
        
        # If not a product request, continue with normal processing
        print(f"[agent] ➡️ Passing to normal LLM processing: '{transcript}'")
        # Note: We'll let the normal session handle non-product requests


class Assistant(Agent):
    def __init__(self, instructions: str, room: rtc.Room):
        super().__init__(instructions=instructions)
        self._room = room

    async def send_product(self, product_key: str):
        """Publish a 'product.share' event that React listens for."""
        try:
            payload = {"type": "product.share", "productKey": product_key}
            await self._room.local_participant.publish_data(
                json.dumps(payload).encode("utf-8")
            )
            print(f"[agent] ✅ Sent product.share for: {product_key}")
        except Exception as e:
            print(f"[agent] ❌ Failed to send product data: {e}")

    async def handle_product_request(self, transcript: str) -> bool:
        """Handle product requests and return True if handled"""
        transcript_lower = transcript.lower().strip()
        
        # Check for product requests
        if any(phrase in transcript_lower for phrase in ["show me", "i want to see", "display", "let me see"]):
            print(f"[agent] 🎯 Detected product request!")
            
            # Parse the request
            color = "white"
            material = "silk"
            product_type = "blouse"
            
            # Extract color
            if "black" in transcript_lower: color = "black"
            elif "blue" in transcript_lower: color = "blue"
            elif "navy" in transcript_lower: color = "navy"
            elif "pink" in transcript_lower: color = "pink"
            elif "red" in transcript_lower: color = "red"
            elif "gray" in transcript_lower or "grey" in transcript_lower: color = "gray"
            elif "beige" in transcript_lower: color = "beige"
            elif "cream" in transcript_lower: color = "cream"
            elif "rose" in transcript_lower: color = "rose"
            
            # Extract material
            if "cotton" in transcript_lower: material = "cotton"
            elif "denim" in transcript_lower: material = "denim"
            elif "leather" in transcript_lower: material = "leather"
            elif "wool" in transcript_lower: material = "wool"
            elif "chiffon" in transcript_lower: material = "chiffon"
            elif "polyester" in transcript_lower: material = "polyester"
            elif "satin" in transcript_lower: material = "satin"
            
            # Extract product type
            if "blouse" in transcript_lower: product_type = "blouse"
            elif "t-shirt" in transcript_lower or "tshirt" in transcript_lower: product_type = "tshirt"
            elif "dress" in transcript_lower: product_type = "dress"
            elif "jeans" in transcript_lower: product_type = "jeans"
            elif "jacket" in transcript_lower: product_type = "jacket"
            elif "coat" in transcript_lower: product_type = "coat"
            elif "trousers" in transcript_lower: product_type = "trousers"
            
            print(f"[agent] 🔍 Parsed: {color} {material} {product_type}")
            
            # Generate product key
            if product_type == "jeans":
                product_key = f"{material}_{product_type}_{color}_skinny"
            elif product_type == "dress":
                style_map = {
                    ("blue", "cotton"): "casual",
                    ("white", "cotton"): "summer", 
                    ("black", "silk"): "formal",
                    ("red", "satin"): "evening",
                    ("pink", "chiffon"): "summer"
                }
                style = style_map.get((color, material), "casual")
                product_key = f"{material}_{product_type}_{color}_{style}"
            elif product_type == "coat" and material == "cotton" and color == "beige":
                product_key = f"{material}_{product_type}_{color}_trench"
            else:
                product_key = f"{material}_{product_type}_{color}"
            
            print(f"[agent] 🔑 Generated key: {product_key}")
            
            # Send the product
            await self.send_product(product_key)
            
            return True  # Handled
            
        return False  # Not handled

    @function_tool
    async def show_product(self, product_type: str, color: str, material: str = "silk"):
        """Show a specific product to the user."""
        print(f"[agent] 🎯 FUNCTION TOOL CALLED: show_product({product_type}, {color}, {material})")
        product_key = f"{material}_{product_type}_{color}"
        await self.send_product(product_key)
        return f"Showing {color} {material} {product_type}"


async def entrypoint(ctx: agents.JobContext):
    # Connect the agent to the room
    await ctx.connect()

    # Wait for the browser participant
    participant = await ctx.wait_for_participant()

    # Parse prompt from participant.metadata
    instructions = ""
    try:
        if participant.metadata:
            meta = json.loads(participant.metadata)
            if isinstance(meta, dict):
                instructions = str(meta.get("prompt", ""))
    except Exception:
        pass
    
    if not instructions:
        instructions = "You are an ai assistant"

    # Create the assistant
    assistant = Assistant(instructions=instructions, room=ctx.room)
    
    # Create our custom session with the BEST function calling model
    session = ProductDetectingSession(
        stt=deepgram.STT(model="nova-3"),
        llm=groq.LLM(model="llama-3.3-70b-versatile", temperature=0.1),  # Best for tool use!
        tts=deepgram.TTS(model="aura-asteria-en"),
    )
    
    # Connect the session and assistant
    session.set_product_assistant(assistant)
    
    # Alternative approach: Hook into the session's transcript processing
    original_on_user_speech_final = getattr(session, '_on_user_speech_final', None)
    
    async def enhanced_on_user_speech_final(transcript: str):
        """Enhanced speech final handler"""
        print(f"[agent] 🎤 Speech final detected: '{transcript}'")
        
        # Try to handle as product request first
        handled = await assistant.handle_product_request(transcript)
        if not handled and original_on_user_speech_final:
            # If not handled, pass to original handler
            await original_on_user_speech_final(transcript)
    
    # Try to replace the handler
    if hasattr(session, '_on_user_speech_final'):
        session._on_user_speech_final = enhanced_on_user_speech_final
    
    # Hook into STT events if available
    if hasattr(session, '_stt') and hasattr(session._stt, 'on'):
        def on_stt_final(event):
            if hasattr(event, 'transcript'):
                print(f"[agent] 🎤 STT final: '{event.transcript}'")
                asyncio.create_task(assistant.handle_product_request(event.transcript))
        
        try:
            session._stt.on('transcript_final', on_stt_final)
        except Exception as e:
            print(f"[agent] ⚠️ Could not hook STT events: {e}")
    
    # Start the session
    await session.start(room=ctx.room, agent=assistant)
    
    print("[agent] ✅ Assistant started with transcript override")
    print("[agent] 💡 Monitoring transcript events...")
    print("[agent] 🎯 Say 'show me a black silk blouse' to test")
    
    # Generate initial greeting
    try:
        await session.generate_reply()
        print("[agent] 🎤 Initial greeting generated")
    except Exception as e:
        print(f"[agent] ❌ Error generating greeting: {e}")
    

    
    # Fallback: Monitor session activity for transcripts
    async def monitor_session_activity():
        """Monitor session for any transcript activity"""
        last_check = ""
        while True:
            try:
                await asyncio.sleep(0.5)
                
                # Check if session has any transcript context we can access
                if hasattr(session, '_chat_ctx') and session._chat_ctx:
                    # Look for recent user messages
                    if hasattr(session._chat_ctx, 'messages') and session._chat_ctx.messages:
                        for msg in session._chat_ctx.messages[-2:]:  # Check last 2 messages
                            if (hasattr(msg, 'role') and msg.role == 'user' and 
                                hasattr(msg, 'content') and msg.content and 
                                msg.content != last_check):
                                
                                print(f"[agent] 📝 Found user message: '{msg.content}'")
                                handled = await assistant.handle_product_request(msg.content)
                                last_check = msg.content
                                if handled:
                                    break
                
            except Exception as e:
                # Silent monitoring
                pass
    
    asyncio.create_task(monitor_session_activity())


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))