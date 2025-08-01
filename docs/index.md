---
id: index
title: Introduction
sidebar_position: 1
---

# Introduction to UTCP

The Universal Tool Calling Protocol (UTCP) is a modern, flexible, and scalable standard for defining and interacting with tools across a wide variety of communication protocols.

## Core Components

UTCP consists of three main components:

1. **Manuals**: The standard description format that contains tool definitions
2. **Tools**: The individual capabilities that can be called
3. **Providers**: The communication channels through which tools and manuals are accessed

## The "Manual" Approach

UTCP's fundamental philosophy is to act as a descriptive manual rather than a prescriptive middleman:

:::note
A UTCP Manual tells an agent: "Here is a tool. Here is its native endpoint (HTTP, WebSocket, CLI, etc.), and here is how to call it directly."
:::

This approach eliminates the need for wrapper servers and allows direct communication between agents and tools.

## Minimal Example

Let's see how easy it is to use UTCP with a minimal example.

### 1. Defining a Tool (Tool Provider)

Create a simple HTTP endpoint that serves a UTCP Manual (JSON):

```python
# app.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/utcp")
def utcp_discovery():
    return {
        "version": "1.0",
        "tools": [
            {
                "name": "get_weather",
                "description": "Get current weather for a location",
                "inputs": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "City name"
                        }
                    },
                    "required": ["location"]
                },
                "outputs": {
                    "type": "object",
                    "properties": {
                        "temperature": {"type": "number"},
                        "conditions": {"type": "string"}
                    }
                },
                "tool_provider": {
                    "provider_type": "http",
                    "url": "https://example.com/api/weather",
                    "http_method": "GET"
                }
            }
        ]
    }

# Implement the actual weather API endpoint
@app.get("/api/weather")
def get_weather(location: str):
    # In a real app, you'd fetch actual weather data
    return {"temperature": 22.5, "conditions": "Sunny"}
```

Run the server:

```bash
uvicorn app:app --reload
```

### 2. Using the Tool (Client)

```python
# client.py
import asyncio
from utcp.client.utcp_client import UtcpClient
from utcp.shared.provider import HttpProvider

async def main():
    # Create a UTCP client
    client = await UtcpClient.create()

    # Define the manual provider (points to the discovery endpoint)
    manual_provider = HttpProvider(
        name="weather_service",
        provider_type="http",
        http_method="GET",
        url="http://localhost:8000/utcp"
    )

    # Register tools from the manual provider
    tools = await client.register_tool_provider(manual_provider)
    print(f"Registered {len(tools)} tools from {manual_provider.name}")

    # Call a tool by its namespaced name: {provider_name}.{tool_name}
    result = await client.call_tool(
        "weather_service.get_weather", 
        arguments={"location": "San Francisco"}
    )
    print(f"Weather: {result['temperature']}°C, {result['conditions']}")

if __name__ == "__main__":
    asyncio.run(main())
```

Run the client:

```bash
python client.py
```

## Benefits of the UTCP Approach

1. **Direct Communication**: The client calls the tool's native endpoint directly
2. **No Wrapper Infrastructure**: No need to build and maintain wrapper servers
3. **Leverage Existing Systems**: Uses the tool's existing authentication, rate limiting, etc.
4. **Flexible Protocol Support**: Works with any communication protocol (HTTP, WebSockets, CLI, etc.)

In the following sections, we'll explore the details of UTCP's components and how to implement them in your applications.
