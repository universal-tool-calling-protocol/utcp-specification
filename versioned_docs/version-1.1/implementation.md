---
id: implementation
title: Implementation Guide
sidebar_position: 4
---

# UTCP Implementation Guide

This guide covers the core concepts and patterns for implementing UTCP in any programming language, whether you're building tool providers or tool consumers.

## Quick Start

### 1. Install UTCP Library

Choose the UTCP implementation for your programming language:

- **Python**: `pip install utcp utcp-http utcp-cli`
- **Node.js**: `npm install @utcp/core @utcp/http @utcp/cli`
- **Other languages**: Check the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol)

### 2. Create Your First Tool Provider

Create an HTTP endpoint that serves a UTCP manual:

**Endpoint**: `GET /utcp`
**Response**:
```json
{
  "manual_version": "1.0.0",
  "utcp_version": "1.0.1",
  "info": {
    "title": "Weather API",
    "version": "1.0.0"
  },
  "tools": [
    {
      "name": "get_weather",
      "description": "Get current weather for a location",
      "inputs": {
        "type": "object",
        "properties": {
          "location": {"type": "string"}
        },
        "required": ["location"]
      },
      "tool_call_template": {
        "call_template_type": "http",
        "url": "https://api.weather.com/current",
        "http_method": "GET",
        "auth": {
            "auth_type": "api_key",
            "api_key": "${WEATHER_API_KEY}",
            "var_name": "appid",
            "location": "query"
        }
      }
    }
  ]
}
```

### 3. Create Your First Client

Configure a UTCP client to discover and call tools:

**Configuration**:
```json
{
  "manual_call_templates": [
    {
      "name": "weather_service",
      "call_template_type": "http",
      "url": "https://api.weather.com/utcp",
      "http_method": "GET"
    }
  ],
  "variables": {
    "WEATHER_API_KEY": "your-api-key"
  }
}
```

**Usage**:
1. Initialize UTCP client with configuration
2. Discover tools from the weather service
3. Call the `get_weather` tool with location parameter

## Core Concepts

### UTCP Manual

A UTCP manual is a JSON document that describes available tools and how to call them:

```json
{
  "manual_version": "1.0.0",
  "utcp_version": "1.0.1",
  "info": {
    "title": "API Name",
    "version": "1.0.0",
    "description": "API description"
  },
  "tools": [
    {
      "name": "tool_name",
      "description": "Tool description",
      "inputs": {
        "type": "object",
        "properties": {
          "param": {"type": "string"}
        }
      },
      "outputs": {
        "type": "object",
        "properties": {
          "result": {"type": "string"}
        }
      },
      "tool_call_template": {
        "call_template_type": "http",
        "url": "https://api.example.com/endpoint",
        "http_method": "POST"
      }
    }
  ]
}
```

### Call Templates

Call templates define how to invoke tools using specific protocols:

#### HTTP Call Template
```json
{
  "call_template_type": "http",
  "url": "https://api.example.com/endpoint",
  "http_method": "POST",
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_TOKEN}",
    "var_name": "Authorization",
    "location": "header"
  },
  "body_field": "body"
}

Tool arguments not used in the URL path or headers will be sent as query parameters for GET requests, or in the request body for POST/PUT/PATCH requests. The `body_field` specifies which tool argument contains the data for the request body.
```

#### CLI Call Template
```json
{
  "call_template_type": "cli",
  "commands": [
    {
      "command": "cd /app",
      "append_to_final_output": false
    },
    {
      "command": "python script.py UTCP_ARG_input_UTCP_END",
      "append_to_final_output": true
    }
  ],
  "env_vars": {
    "PYTHONPATH": "/app/lib"
  },
  "working_dir": "/app"
}
```

### Variable Substitution

Variables in call templates are replaced with actual values using two different syntaxes:

- **URL path parameters** (from tool arguments): `{argument_name}` - single braces, no dollar sign
- **Configuration/environment variables**: `${VAR_NAME}` - dollar sign with braces

For example, `https://api.example.com/users/{user_id}` uses the `user_id` tool argument, while `${API_KEY}` references a configuration or environment variable.

## Tool Provider Implementation

### Manual Structure

Create a well-structured UTCP manual:

1. **Info Section**: Describe your API
2. **Tools Array**: Define each available tool
3. **Input Schemas**: Specify required parameters
4. **Output Schemas**: Document return values
5. **Call Templates**: Define how to invoke each tool

### Discovery Endpoint

Expose your manual via HTTP:

```
GET /utcp
Content-Type: application/json

{
  "manual_version": "1.0.0",
  "utcp_version": "1.0.1",
  "tools": [...]
}
```

### Authentication

Support various authentication methods:

#### API Key Authentication
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

#### OAuth2 Authentication
```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token"
  }
}
```

## Tool Consumer Implementation

### Client Configuration

Configure your UTCP client:

#### File-based Configuration
```yaml
# utcp-config.yaml
manual_call_templates:
  - name: weather_service
    call_template_type: http
    url: https://api.weather.com/utcp

variables:
  WEATHER_API_KEY: your-api-key
  
load_variables_from:
  - variable_loader_type: dotenv
    env_file_path: .env
```

#### Programmatic Configuration
```json
{
  "manual_call_templates": [
    {
      "name": "service_name",
      "call_template_type": "http",
      "url": "https://api.example.com/utcp"
    }
  ],
  "variables": {
    "API_KEY": "your-key"
  }
}
```

### Tool Discovery

Discover available tools:

1. **List Tools**: Get all available tools
2. **Tool Information**: Get detailed tool metadata
3. **Filter Tools**: Find tools by name, tags, or description

### Tool Execution

Execute tools with proper error handling:

1. **Basic Calls**: Simple tool invocation
2. **Batch Calls**: Execute multiple tools
3. **Context Passing**: Pass context between calls
4. **Error Handling**: Handle failures gracefully

## Advanced Implementation Patterns

### Custom Protocol Plugins

Extend UTCP with custom communication protocols:

1. **Define Call Template**: Structure for your protocol
2. **Implement Communication Handler**: Protocol-specific logic
3. **Register Protocol**: Make it available to clients

Example custom protocol structure:
```json
{
  "call_template_type": "custom",
  "custom_field": "value",
  "timeout": 30
}
```

### Custom Tool Repositories

Implement custom tool storage:

1. **Tool Storage**: How tools are stored and retrieved
2. **Search Functionality**: Tool discovery and filtering
3. **Caching**: Performance optimization
4. **Synchronization**: Multi-client coordination

### Testing Strategies

#### Unit Testing Tool Providers
- Test manual generation
- Validate tool definitions
- Test authentication
- Mock external dependencies

#### Integration Testing
- Test tool discovery
- Test tool execution
- Test error scenarios
- Test performance

#### End-to-End Testing
- Test complete workflows
- Test multiple protocols
- Test real-world scenarios
- Test scalability

## Best Practices

### Performance
- Use connection pooling
- Implement caching
- Optimize tool discovery
- Monitor response times

### Security
- Validate all inputs
- Use secure authentication
- Implement rate limiting
- Log security events

### Reliability
- Implement retry logic
- Handle network failures
- Use circuit breakers
- Monitor tool health

### Maintainability
- Version your manuals
- Document all tools
- Use consistent naming
- Provide examples

## Deployment Considerations

### Scaling
- Load balance tool providers
- Cache tool discoveries
- Use async processing
- Monitor resource usage

### Monitoring
- Track tool usage
- Monitor error rates
- Log performance metrics
- Set up alerts

### Security
- Use HTTPS everywhere
- Implement proper authentication
- Validate all inputs
- Monitor for abuse

## Language-Specific Implementation

For detailed implementation examples and code samples in your programming language:

- **Multi-language**: [UTCP Implementation Examples](https://github.com/universal-tool-calling-protocol) - Examples across Python, TypeScript, Go, and other languages
- **TypeScript**: [TypeScript UTCP Documentation](https://github.com/universal-tool-calling-protocol/typescript-utcp/tree/main/docs)
- **Other languages**: Check respective repositories in the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol)

For more detailed information, see:
- [Communication Protocol Plugins](./protocols/index.md)
- [API Reference](./api/index.md)
- [Security Considerations](./security.md)
