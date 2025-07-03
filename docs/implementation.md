---
title: Implementation Guide
layout: default
nav_order: 5
has_children: true
permalink: /docs/implementation
---

# Implementation Guide

This guide will walk you through the process of implementing UTCP in your applications, whether you're creating a tool provider or developing a client that consumes tools.

## Overview

Implementing UTCP typically involves one or both of the following:

1. **Creating a Tool Provider**: Exposing your tools through a UTCP-compliant discovery endpoint
2. **Building a UTCP Client**: Consuming tools from UTCP providers

## Creating a Tool Provider

A UTCP tool provider exposes one or more tools through a standardized discovery endpoint. Here's how to implement one:

### Step 1: Define Your Tools

First, define the tools you want to expose using the UTCP `Tool` model:

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a location",
        "inputs": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                },
                "unit": {
                    "type": "string",
                    "description": "The unit of temperature (celsius or fahrenheit)",
                    "enum": ["celsius", "fahrenheit"]
                }
            },
            "required": ["location"],
            "description": "Weather query parameters"
        },
        "outputs": {
            "type": "object",
            "properties": {
                "temperature": {
                    "type": "number",
                    "description": "The current temperature"
                },
                "conditions": {
                    "type": "string",
                    "description": "The weather conditions (e.g., sunny, cloudy)"
                }
            },
            "required": ["temperature", "conditions"],
            "description": "Weather information"
        },
        "tags": ["weather", "api"],
        "provider": {
            "name": "weather_service",
            "provider_type": "http",
            "url": "https://api.example.com/weather",
            "http_method": "GET"
        }
    }
]
```

### Step 2: Create a Discovery Endpoint

Create an endpoint that returns a `UTCPManual` containing your tool definitions:

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class UTCPManual(BaseModel):
    version: str
    tools: List[dict]

@app.get("/utcp")
def utcp_discovery():
    return UTCPManual(
        version="1.0",
        tools=tools
    )
```

### Step 3: Implement Tool Functionality

Implement the actual functionality of each tool according to its provider specification. For example, for an HTTP provider:

```python
@app.get("/weather")
def get_weather(location: str, unit: str = "celsius"):
    # Implement your weather logic here
    return {
        "temperature": 22.5,
        "conditions": "Sunny"
    }
```

## Using a UTCP Client

Here's how you might use a UTCP client:

```python
async def main():
    # Create a client
    client = UtcpClient()
    
    # Register a provider
    await client.register_tool_provider({
        "name": "weather_api",
        "provider_type": "http",
        "url": "https://api.example.com/utcp"
    })
    
    # Call a tool
    result = await client.call_tool("weather_api.get_weather", location="San Francisco")
    print(f"The temperature is {result['temperature']}°C and it's {result['conditions']}")

# Run the example
asyncio.run(main())
```

## Best Practices

When implementing UTCP:

1. **Cache tool discoveries** to reduce load and handle temporary outages
2. **Validate inputs** against the tool's input schema before sending
3. **Handle errors gracefully**, especially for network-related issues
4. **Implement timeouts** to prevent hanging on unresponsive tools
5. **Log tool usage** for debugging and monitoring
