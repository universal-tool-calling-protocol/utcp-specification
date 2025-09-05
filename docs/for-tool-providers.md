---
id: for-tool-providers
title: For Tool Providers
sidebar_position: 2
---

# For Tool Providers

:::info Language Note
This guide uses **Python** examples with the reference implementation. UTCP implementations are available in multiple languages - check the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol) for TypeScript, Go, and other language implementations.
:::

This guide helps you expose your tools through UTCP so they can be discovered and used by AI agents and other applications.

## Overview

As a tool provider, you'll create a **UTCP Manual** - a standardized description of your tools that tells clients how to call them directly using their native protocols. This eliminates the need for wrapper servers and allows direct communication.

## Quick Start

### 1. Create a Simple Manual

```json
{
  "manual_version": "1.0.0",
  "utcp_version": "1.0.1",
  "info": {
    "title": "My API Tools",
    "version": "1.0.0",
    "description": "Collection of useful API tools"
  },
  "tools": [
    {
      "name": "get_user",
      "description": "Retrieve user information by ID",
      "inputs": {
        "type": "object",
        "properties": {
          "user_id": {"type": "string", "description": "User identifier"}
        },
        "required": ["user_id"]
      },
      "outputs": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "name": {"type": "string"},
          "email": {"type": "string"}
        }
      },
      "tool_call_template": {
        "call_template_type": "http",
        "url": "https://api.example.com/users/${user_id}",
        "http_method": "GET",
        "headers": {
          "Authorization": "Bearer ${API_TOKEN}"
        }
      }
    }
  ]
}
```

### 2. Expose via Discovery Endpoint

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/utcp")
def get_utcp_manual():
    return {
        "manual_version": "1.0.0",
        "utcp_version": "1.0.1",
        "tools": [
            # ... your tools here
        ]
    }

# Your existing API endpoints remain unchanged
@app.get("/users/{user_id}")
def get_user(user_id: str):
    return {"id": user_id, "name": "John Doe", "email": "john@example.com"}
```

## Manual Structure

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `manual_version` | string | Version of your manual (semantic versioning) |
| `utcp_version` | string | UTCP specification version |
| `tools` | array | List of available tools |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `info` | object | Metadata about your API |
| `auth` | object | Default authentication for all tools |
| `variables` | object | Default variable values |

### Tool Definition

Each tool must include:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique tool identifier |
| `description` | string | Human-readable description |
| `inputs` | object | JSON Schema for input parameters |
| `tool_call_template` | object | How to call the tool |

Optional tool fields:

| Field | Type | Description |
|-------|------|-------------|
| `outputs` | object | JSON Schema for expected outputs |
| `tags` | array | Tags for categorization and search |
| `examples` | array | Usage examples |

## Communication Protocols

### HTTP Tools

Most common for REST APIs:

```json
{
  "name": "create_user",
  "description": "Create a new user account",
  "inputs": {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "email": {"type": "string", "format": "email"}
    },
    "required": ["name", "email"]
  },
  "tool_call_template": {
    "call_template_type": "http",
    "url": "https://api.example.com/users",
    "http_method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${API_TOKEN}"
    },
    "body": {
      "name": "${name}",
      "email": "${email}"
    }
  }
}
```

### CLI Tools

For command-line applications:

```json
{
  "name": "git_status",
  "description": "Get git repository status",
  "inputs": {
    "type": "object",
    "properties": {
      "repo_path": {"type": "string", "description": "Path to git repository"}
    },
    "required": ["repo_path"]
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "command": "git",
    "args": ["status", "--porcelain"],
    "working_directory": "${repo_path}"
  }
}
```

### WebSocket Tools

For real-time communication:

```json
{
  "name": "subscribe_updates",
  "description": "Subscribe to real-time updates",
  "inputs": {
    "type": "object",
    "properties": {
      "channel": {"type": "string"}
    },
    "required": ["channel"]
  },
  "tool_call_template": {
    "call_template_type": "websocket",
    "url": "wss://api.example.com/ws",
    "message": {
      "action": "subscribe",
      "channel": "${channel}"
    }
  }
}
```

## Authentication

### API Key Authentication

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}",
    "var_name": "X-API-Key",
    "location": "header"
  }
}
```

### Bearer Token

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "${ACCESS_TOKEN}",
    "var_name": "Authorization",
    "location": "header"
  }
}
```

### OAuth2

```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "read:users write:users"
  }
}
```

### Per-Tool Authentication

```json
{
  "name": "admin_action",
  "description": "Perform admin action",
  "tool_call_template": {
    "call_template_type": "http",
    "url": "https://api.example.com/admin/action",
    "http_method": "POST",
    "auth": {
      "auth_type": "api_key",
      "api_key": "${ADMIN_TOKEN}",
      "var_name": "Authorization",
      "location": "header"
    }
  }
}
```

## Variable Substitution

Use `${VARIABLE_NAME}` syntax for dynamic values:

### From Tool Arguments

```json
{
  "url": "https://api.example.com/users/${user_id}",
  "body": {
    "name": "${name}",
    "email": "${email}"
  }
}
```

### From Environment Variables

```json
{
  "headers": {
    "Authorization": "Bearer ${API_TOKEN}",
    "X-Client-ID": "${CLIENT_ID}"
  }
}
```

### Default Values

```json
{
  "manual_version": "1.0.0",
  "utcp_version": "1.0.1",
  "variables": {
    "base_url": "https://api.example.com",
    "timeout": 30
  },
  "tools": [
    {
      "name": "get_data",
      "tool_call_template": {
        "call_template_type": "http",
        "url": "${base_url}/data",
        "timeout": "${timeout}"
      }
    }
  ]
}
```

## Implementation Examples

### FastAPI Implementation (Python)

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class User(BaseModel):
    id: str
    name: str
    email: str

# Your existing API endpoints
@app.get("/users/{user_id}")
def get_user(user_id: str) -> User:
    # Your existing logic
    return User(id=user_id, name="John Doe", email="john@example.com")

@app.post("/users")
def create_user(user: User) -> User:
    # Your existing logic
    return user

# UTCP Discovery endpoint
@app.get("/utcp")
def get_utcp_manual():
    return {
        "manual_version": "1.0.0",
        "utcp_version": "1.0.1",
        "info": {
            "title": "User Management API",
            "version": "1.0.0",
            "description": "API for managing user accounts"
        },
        "tools": [
            {
                "name": "get_user",
                "description": "Retrieve user information by ID",
                "inputs": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string"}
                    },
                    "required": ["user_id"]
                },
                "outputs": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "name": {"type": "string"},
                        "email": {"type": "string"}
                    }
                },
                "tool_call_template": {
                    "call_template_type": "http",
                    "url": f"{BASE_URL}/users/{{user_id}}",
                    "http_method": "GET",
                    "headers": {
                        "Authorization": "Bearer ${API_TOKEN}"
                    }
                }
            },
            {
                "name": "create_user",
                "description": "Create a new user account",
                "inputs": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "email": {"type": "string", "format": "email"}
                    },
                    "required": ["name", "email"]
                },
                "tool_call_template": {
                    "call_template_type": "http",
                    "url": f"{BASE_URL}/users",
                    "http_method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer ${API_TOKEN}"
                    },
                    "body": {
                        "name": "${name}",
                        "email": "${email}"
                    }
                }
            }
        ]
    }
```

### Express.js Implementation

```javascript
const express = require('express');
const app = express();

// Your existing API endpoints
app.get('/users/:userId', (req, res) => {
  // Your existing logic
  res.json({
    id: req.params.userId,
    name: 'John Doe',
    email: 'john@example.com'
  });
});

// UTCP Discovery endpoint
app.get('/utcp', (req, res) => {
  res.json({
    manual_version: "1.0.0",
    utcp_version: "1.0.1",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "API for managing user accounts"
    },
    tools: [
      {
        name: "get_user",
        description: "Retrieve user information by ID",
        inputs: {
          type: "object",
          properties: {
            user_id: { type: "string" }
          },
          required: ["user_id"]
        },
        tool_call_template: {
          call_template_type: "http",
          url: `${process.env.BASE_URL}/users/\${user_id}`,
          http_method: "GET",
          headers: {
            "Authorization": "Bearer ${API_TOKEN}"
          }
        }
      }
    ]
  });
});

app.listen(3000);
```

## OpenAPI Integration

Convert existing OpenAPI specifications to UTCP manuals:

### Python with utcp-http

```python
from utcp_http.openapi_converter import OpenApiConverter

# Convert OpenAPI spec to UTCP manual
converter = OpenApiConverter()
manual = await converter.convert_openapi_to_manual(
    "https://api.example.com/openapi.json",
    base_url="https://api.example.com"
)

# Serve the converted manual
@app.get("/utcp")
def get_utcp_manual():
    return manual.model_dump()
```

### Customizing OpenAPI Conversion

```python
# Convert with custom settings
manual = await converter.convert_openapi_to_manual(
    "https://api.example.com/openapi.json",
    base_url="https://api.example.com",
    include_operations=["get", "post"],  # Only include specific operations
    exclude_paths=["/internal/*"],       # Exclude internal paths
    auth_template={                      # Default auth for all tools
        "auth_type": "api_key",
        "api_key": "${API_KEY}",
        "var_name": "X-API-Key",
        "location": "header"
    }
)
```

## Best Practices

### Manual Design

1. **Clear Descriptions**: Write clear, concise tool descriptions
2. **Comprehensive Schemas**: Use detailed JSON schemas for inputs/outputs
3. **Consistent Naming**: Use consistent naming conventions
4. **Version Management**: Use semantic versioning for your manual
5. **Documentation**: Include examples and usage notes

### Security

1. **Authentication**: Always implement proper authentication
2. **Input Validation**: Validate all inputs on your API side
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **HTTPS Only**: Use HTTPS for all production endpoints
5. **Credential Management**: Never hardcode credentials in manuals

### Performance

1. **Efficient Endpoints**: Design efficient API endpoints
2. **Caching**: Implement appropriate caching strategies
3. **Pagination**: Use pagination for large result sets
4. **Timeouts**: Set reasonable timeout values
5. **Monitoring**: Monitor API performance and usage

### Maintenance

1. **Versioning**: Version your manual and API together
2. **Backward Compatibility**: Maintain backward compatibility when possible
3. **Deprecation**: Provide clear deprecation notices
4. **Testing**: Test your manual with UTCP clients
5. **Documentation**: Keep documentation up to date

## Testing Your Manual

### Manual Validation

```python
from utcp.data.utcp_manual import UtcpManual
import json

# Load and validate your manual
with open('manual.json', 'r') as f:
    manual_data = json.load(f)

try:
    manual = UtcpManual(**manual_data)
    print("Manual is valid!")
except Exception as e:
    print(f"Manual validation failed: {e}")
```

### Integration Testing

```python
import pytest
from utcp.utcp_client import UtcpClient

@pytest.mark.asyncio
async def test_manual_integration():
    client = await UtcpClient.create(config={
        "manual_call_templates": [
            {
                "name": "test_service",
                "call_template_type": "http",
                "url": "http://localhost:8000/utcp",
                "http_method": "GET"
            }
        ]
    })
    
    # Test tool discovery
    tools = await client.list_tools()
    assert len(tools) > 0
    
    # Test tool call
    result = await client.call_tool(
        "test_service.get_user",
        tool_args={"user_id": "123"}
    )
    assert "id" in result
```

## Migration Strategies

### From OpenAPI

1. **Automatic Conversion**: Use OpenAPI converter for initial conversion
2. **Manual Refinement**: Refine converted manual for better descriptions
3. **Authentication Setup**: Configure authentication properly
4. **Testing**: Test converted manual thoroughly

### From MCP

1. **Wrapper Approach**: Use UTCP-MCP plugin initially
2. **Gradual Migration**: Migrate tools one by one to native protocols
3. **Direct Implementation**: Implement tools using native UTCP protocols
4. **Deprecation**: Remove MCP dependency once migration is complete

## Common Patterns

### CRUD Operations

```json
{
  "tools": [
    {
      "name": "create_resource",
      "tool_call_template": {
        "call_template_type": "http",
        "url": "https://api.example.com/resources",
        "http_method": "POST"
      }
    },
    {
      "name": "get_resource",
      "tool_call_template": {
        "call_template_type": "http",
        "url": "https://api.example.com/resources/${id}",
        "http_method": "GET"
      }
    },
    {
      "name": "update_resource",
      "tool_call_template": {
        "call_template_type": "http",
        "url": "https://api.example.com/resources/${id}",
        "http_method": "PUT"
      }
    },
    {
      "name": "delete_resource",
      "tool_call_template": {
        "call_template_type": "http",
        "url": "https://api.example.com/resources/${id}",
        "http_method": "DELETE"
      }
    }
  ]
}
```

### Batch Operations

```json
{
  "name": "batch_process",
  "description": "Process multiple items in batch",
  "inputs": {
    "type": "object",
    "properties": {
      "items": {
        "type": "array",
        "items": {"type": "object"}
      }
    }
  },
  "tool_call_template": {
    "call_template_type": "http",
    "url": "https://api.example.com/batch",
    "http_method": "POST",
    "body": {
      "items": "${items}"
    }
  }
}
```

## Next Steps

1. **Design Your Manual**: Plan your tool structure and descriptions
2. **Choose Protocols**: Select appropriate communication protocols
3. **Implement Discovery**: Add the `/utcp` endpoint to your API
4. **Test Integration**: Test with UTCP clients
5. **Monitor Usage**: Monitor how your tools are being used
6. **Iterate**: Improve based on usage patterns and feedback

For more information, see:
- [Communication Protocols](./providers/index.md)
- [Implementation Guide](./implementation.md)
- [Security Considerations](./security.md)
