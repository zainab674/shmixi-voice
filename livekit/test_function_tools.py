#!/usr/bin/env python3
"""
Test script for LiveKit function tools.
This tests the core logic without needing LiveKit.
"""

import asyncio
import json

# Mock the LiveKit imports
class MockRoom:
    def __init__(self):
        self.local_participant = MockParticipant()

class MockParticipant:
    async def publish_data(self, data, kind):
        print(f"[MOCK] 📤 Publishing data: {data.decode('utf-8')} (kind: {kind})")
        return True

# Test the Assistant class
class Assistant:
    def __init__(self, instructions: str, room):
        self._room = room
        self.instructions = instructions

    async def send_product(self, product_key: str):
        """Publish a 'product.share' event that React listens for."""
        try:
            payload = {"type": "product.share", "productKey": product_key}
            await self._room.local_participant.publish_data(
                data=json.dumps(payload).encode("utf-8"),
                kind="RELIABLE",
            )
            print(f"[TEST] ✅ Sent product.share for: {product_key}")
        except Exception as e:
            print(f"[TEST] ❌ Failed to send product data: {e}")

    async def show_product(self, product_type: str, color: str):
        """Show a specific product to the user."""
        product_key = f"silk_{product_type}_{color}"
        await self.send_product(product_key)
        return f"Showing {color} {product_type}"

    async def search_catalog(self, query: str):
        """Search the product catalog for items matching the query."""
        query_lower = query.lower()
        if "white" in query_lower and "silk" in query_lower and "blouse" in query_lower:
            await self.send_product("silk_blouse_white")
            return "Found white silk blouse"
        elif "black" in query_lower and "silk" in query_lower and "blouse" in query_lower:
            await self.send_product("silk_blouse_black")
            return "Found black silk blouse"
        return "No matching product found"

async def test_function_tools():
    """Test the function tools."""
    print("🧪 Testing LiveKit Function Tools")
    print("=" * 50)
    
    # Create mock room and assistant
    mock_room = MockRoom()
    assistant = Assistant("Test instructions", mock_room)
    
    # Test show_product function
    print("\n1. Testing show_product function:")
    result = await assistant.show_product("blouse", "white")
    print(f"   Result: {result}")
    
    result = await assistant.show_product("blouse", "black")
    print(f"   Result: {result}")
    
    # Test search_catalog function
    print("\n2. Testing search_catalog function:")
    result = await assistant.search_catalog("show me a white silk blouse")
    print(f"   Result: {result}")
    
    result = await assistant.search_catalog("I want to see the black silk blouse")
    print(f"   Result: {result}")
    
    result = await assistant.search_catalog("no product mentioned")
    print(f"   Result: {result}")
    
    print("\n" + "=" * 50)
    print("✅ Function tool testing completed!")

if __name__ == "__main__":
    asyncio.run(test_function_tools())
