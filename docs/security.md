---
id: security
title: Security Considerations
sidebar_position: 6
---

# Security Considerations

:::info Language Examples
This guide uses **Python** examples for implementation code. UTCP security principles apply to all language implementations - check the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol) for language-specific security examples.
:::

Security is critical when enabling direct tool access through UTCP. This guide covers security considerations specific to UTCP's "manual" approach and provides practical guidance for secure implementations.

## UTCP Security Model

### Direct Communication Implications

UTCP's direct communication model has unique security characteristics:

**Advantages:**
- No middleman to compromise
- Native security controls remain intact
- Reduced attack surface (no proxy servers)
- Existing monitoring and logging continue to work

**Considerations:**
- Clients must handle multiple authentication methods
- Manual endpoints become discovery targets
- Variable substitution introduces injection risks

### Manual Discovery Security

Secure your UTCP manual endpoints:

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer

app = FastAPI()
security = HTTPBearer()

@app.get("/utcp")
def get_manual(token: str = Depends(security)):
    # Validate discovery access
    if not validate_discovery_token(token.credentials):
        raise HTTPException(401, "Invalid discovery token")
    
    return {
        "manual_version": "1.0.0",
        "utcp_version": "1.0.1",
        "tools": get_authorized_tools(token.credentials)
    }

def get_authorized_tools(token: str):
    # Return only tools the client is authorized to see
    user_permissions = get_user_permissions(token)
    return filter_tools_by_permissions(all_tools, user_permissions)
```

## Authentication & Authorization

### Enhanced Authentication Examples

#### API Key with Rotation

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

**Secure implementation:**
```python
import os
from datetime import datetime, timedelta

class RotatingAPIKey:
    def __init__(self):
        self.current_key = os.getenv("API_KEY_CURRENT")
        self.next_key = os.getenv("API_KEY_NEXT")
        self.rotation_time = datetime.fromisoformat(os.getenv("KEY_ROTATION_TIME"))
    
    def get_valid_key(self):
        if datetime.now() > self.rotation_time:
            return self.next_key
        return self.current_key
```

#### OAuth2 with Scope Validation

```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "tools:read tools:execute"
  }
}
```

#### Per-Tool Authorization

```json
{
  "name": "admin_tool",
  "description": "Administrative operations",
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

## Protocol-Specific Security

### HTTP/HTTPS Security

**Required configurations:**
```json
{
  "call_template_type": "http",
  "url": "https://api.example.com/endpoint",
  "verify_ssl": true,
  "timeout": 30,
  "headers": {
    "User-Agent": "UTCP-Client/1.0",
    "X-Request-ID": "${request_id}"
  }
}
```

**Security checklist:**
- ✅ Always use HTTPS in production
- ✅ Validate SSL certificates (`verify_ssl: true`)
- ✅ Set appropriate timeouts
- ✅ Include request tracking headers
- ✅ Implement retry limits

### WebSocket Security

**Secure WebSocket configuration:**
```json
{
  "call_template_type": "websocket",
  "url": "wss://api.example.com/ws",
  "headers": {
    "Authorization": "Bearer ${WS_TOKEN}",
    "Origin": "https://trusted-domain.com"
  },
  "ping_interval": 30,
  "connection_timeout": 10
}
```

**Security measures:**
- ✅ Use WSS (secure WebSocket) only
- ✅ Validate Origin headers
- ✅ Implement connection timeouts
- ✅ Use heartbeat/ping for connection health
- ✅ Limit concurrent connections per client

### CLI Security

:::danger High Risk Protocol
CLI execution poses significant security risks. Use with extreme caution.
:::

**Secure CLI implementation:**
```json
{
  "call_template_type": "cli",
  "command": "/usr/local/bin/safe-script",
  "args": ["--input", "${sanitized_input}"],
  "working_directory": "/safe/sandbox",
  "environment": {
    "PATH": "/usr/local/bin:/usr/bin",
    "HOME": "/tmp/sandbox"
  },
  "timeout": 30,
  "allowed_exit_codes": [0]
}
```

**Security requirements:**
- ✅ Use absolute paths for commands
- ✅ Sanitize all input parameters
- ✅ Run in sandboxed environments
- ✅ Limit environment variables
- ✅ Set strict timeouts
- ✅ Validate exit codes
- ✅ Use minimal user permissions

**Input sanitization example:**
```python
import re
import shlex

def sanitize_cli_input(input_value: str) -> str:
    # Remove dangerous characters
    sanitized = re.sub(r'[;&|`$(){}[\]<>]', '', input_value)
    # Escape for shell safety
    return shlex.quote(sanitized)
```

### Server-Sent Events (SSE) Security

**Secure SSE configuration:**
```json
{
  "call_template_type": "sse",
  "url": "https://api.example.com/events",
  "headers": {
    "Authorization": "Bearer ${SSE_TOKEN}",
    "Accept": "text/event-stream",
    "Cache-Control": "no-cache"
  },
  "timeout": 300,
  "max_events": 1000
}
```

**Security considerations:**
- ✅ Authenticate SSE connections
- ✅ Set maximum event limits
- ✅ Implement connection timeouts
- ✅ Validate event data format
- ✅ Monitor for event flooding

### Text Protocol Security

**Secure file access:**
```json
{
  "call_template_type": "text",
  "file_path": "/safe/data/${filename}",
  "max_size": 1048576,
  "allowed_paths": ["/safe/data/"],
  "encoding": "utf-8"
}
```

**Security measures:**
- ✅ Restrict file paths to safe directories
- ✅ Set maximum file size limits
- ✅ Validate file extensions
- ✅ Prevent directory traversal attacks
- ✅ Use safe encoding handling

**Path validation example:**
```python
import os
from pathlib import Path

def validate_file_path(file_path: str, allowed_dirs: list) -> bool:
    try:
        # Resolve to absolute path
        abs_path = Path(file_path).resolve()
        
        # Check if path is within allowed directories
        for allowed_dir in allowed_dirs:
            if abs_path.is_relative_to(Path(allowed_dir).resolve()):
                return True
        return False
    except (OSError, ValueError):
        return False
```

### MCP Security

**Secure MCP server configuration:**
```json
{
  "call_template_type": "mcp",
  "server_config": {
    "command": "/usr/local/bin/mcp-server",
    "args": ["--config", "/safe/config.json"],
    "env": {
      "MCP_LOG_LEVEL": "INFO"
    },
    "timeout": 60
  }
}
```

**Security considerations:**
- ✅ Use trusted MCP server implementations
- ✅ Sandbox MCP server processes
- ✅ Limit server resource usage
- ✅ Monitor server health and logs
- ✅ Implement server restart policies

## Input Validation & Sanitization

### JSON Schema Validation

**Comprehensive input validation:**
```json
{
  "inputs": {
    "type": "object",
    "properties": {
      "email": {
        "type": "string",
        "format": "email",
        "maxLength": 254
      },
      "age": {
        "type": "integer",
        "minimum": 0,
        "maximum": 150
      },
      "tags": {
        "type": "array",
        "items": {"type": "string", "pattern": "^[a-zA-Z0-9_-]+$"},
        "maxItems": 10
      }
    },
    "required": ["email"],
    "additionalProperties": false
  }
}
```

### Parameter Sanitization

**Server-side validation:**
```python
from pydantic import BaseModel, validator, Field
import re

class ToolInput(BaseModel):
    user_id: str = Field(..., regex=r'^[a-zA-Z0-9_-]+$', max_length=50)
    query: str = Field(..., max_length=1000)
    
    @validator('query')
    def sanitize_query(cls, v):
        # Remove potentially dangerous characters
        return re.sub(r'[<>"\']', '', v).strip()
```

## Secure Variable Handling

### Environment Variable Security

**Secure variable loading:**
```python
import os
from typing import Dict, Optional

class SecureVariableLoader:
    def __init__(self, allowed_prefixes: list = None):
        self.allowed_prefixes = allowed_prefixes or ['UTCP_', 'API_']
    
    def load_variable(self, var_name: str) -> Optional[str]:
        # Only load variables with allowed prefixes
        if not any(var_name.startswith(prefix) for prefix in self.allowed_prefixes):
            raise ValueError(f"Variable {var_name} not allowed")
        
        return os.getenv(var_name)
    
    def substitute_variables(self, template: str, context: Dict[str, str]) -> str:
        # Safely substitute variables
        for var_name, value in context.items():
            if self.is_safe_variable(var_name, value):
                template = template.replace(f"${{{var_name}}}", value)
        return template
    
    def is_safe_variable(self, name: str, value: str) -> bool:
        # Validate variable safety
        if len(value) > 10000:  # Prevent extremely long values
            return False
        if any(char in value for char in ['<', '>', '"', "'"]):  # Basic XSS prevention
            return False
        return True
```

### Runtime Variable Substitution

**Secure substitution:**
```python
import re
from typing import Dict

def secure_substitute(template: str, variables: Dict[str, str]) -> str:
    def replace_var(match):
        var_name = match.group(1)
        if var_name in variables:
            value = variables[var_name]
            # Validate and sanitize the value
            if is_safe_value(value):
                return value
            else:
                raise ValueError(f"Unsafe variable value for {var_name}")
        else:
            raise ValueError(f"Variable {var_name} not found")
    
    # Only replace variables with the expected pattern
    return re.sub(r'\$\{([a-zA-Z_][a-zA-Z0-9_]*)\}', replace_var, template)

def is_safe_value(value: str) -> bool:
    # Implement your safety checks
    return len(value) < 1000 and not any(c in value for c in ['<', '>', '"', "'", ';', '&'])
```

## Network & Transport Security

### TLS Configuration

**Minimum TLS requirements:**
```python
import ssl
import httpx

# Configure secure HTTP client
client = httpx.AsyncClient(
    verify=True,  # Verify SSL certificates
    timeout=30.0,
    limits=httpx.Limits(max_connections=100, max_keepalive_connections=20)
)

# For custom SSL context
ssl_context = ssl.create_default_context()
ssl_context.minimum_version = ssl.TLSVersion.TLSv1_2
ssl_context.check_hostname = True
ssl_context.verify_mode = ssl.CERT_REQUIRED
```

### Certificate Validation

**Enhanced certificate validation:**
```python
import ssl
import certifi

def create_secure_context():
    context = ssl.create_default_context(cafile=certifi.where())
    context.check_hostname = True
    context.verify_mode = ssl.CERT_REQUIRED
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    
    # Disable weak ciphers
    context.set_ciphers('ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS')
    
    return context
```

## Monitoring & Incident Response

### Security Logging

**Comprehensive security logging:**
```python
import logging
import json
from datetime import datetime

class SecurityLogger:
    def __init__(self):
        self.logger = logging.getLogger('utcp.security')
        
    def log_tool_call(self, tool_name: str, user_id: str, success: bool, **kwargs):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': 'tool_call',
            'tool_name': tool_name,
            'user_id': user_id,
            'success': success,
            'metadata': kwargs
        }
        self.logger.info(json.dumps(log_entry))
    
    def log_auth_failure(self, tool_name: str, reason: str, **kwargs):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': 'auth_failure',
            'tool_name': tool_name,
            'reason': reason,
            'metadata': kwargs
        }
        self.logger.warning(json.dumps(log_entry))
```

### Anomaly Detection

**Basic anomaly detection:**
```python
from collections import defaultdict
from datetime import datetime, timedelta

class AnomalyDetector:
    def __init__(self):
        self.call_counts = defaultdict(list)
        self.rate_limits = {
            'calls_per_minute': 60,
            'calls_per_hour': 1000
        }
    
    def check_rate_limit(self, user_id: str) -> bool:
        now = datetime.utcnow()
        user_calls = self.call_counts[user_id]
        
        # Clean old entries
        user_calls[:] = [call_time for call_time in user_calls 
                        if now - call_time < timedelta(hours=1)]
        
        # Check limits
        recent_calls = [call_time for call_time in user_calls 
                       if now - call_time < timedelta(minutes=1)]
        
        if len(recent_calls) >= self.rate_limits['calls_per_minute']:
            return False
        if len(user_calls) >= self.rate_limits['calls_per_hour']:
            return False
        
        # Record this call
        user_calls.append(now)
        return True
```

## Security Testing & Validation

### Testing Methodologies

**Security test examples:**
```python
import pytest
from utcp.utcp_client import UtcpClient

@pytest.mark.asyncio
async def test_injection_prevention():
    client = await UtcpClient.create(config=test_config)
    
    # Test SQL injection attempt
    malicious_input = "'; DROP TABLE users; --"
    
    with pytest.raises(ValueError, match="Invalid input"):
        await client.call_tool("db.query", {"query": malicious_input})

@pytest.mark.asyncio
async def test_path_traversal_prevention():
    client = await UtcpClient.create(config=test_config)
    
    # Test directory traversal attempt
    malicious_path = "../../../etc/passwd"
    
    with pytest.raises(ValueError, match="Path not allowed"):
        await client.call_tool("file.read", {"path": malicious_path})

@pytest.mark.asyncio
async def test_rate_limiting():
    client = await UtcpClient.create(config=test_config)
    
    # Test rate limiting
    for i in range(100):  # Exceed rate limit
        try:
            await client.call_tool("api.test", {})
        except Exception as e:
            assert "rate limit" in str(e).lower()
            break
    else:
        pytest.fail("Rate limiting not enforced")
```

### Security Automation

**Automated security checks:**
```python
def validate_manual_security(manual: dict) -> list:
    issues = []
    
    for tool in manual.get('tools', []):
        call_template = tool.get('tool_call_template', {})
        
        # Check for HTTP over HTTPS
        if call_template.get('call_template_type') == 'http':
            url = call_template.get('url', '')
            if url.startswith('http://'):
                issues.append(f"Tool {tool['name']}: Uses insecure HTTP")
        
        # Check for hardcoded credentials
        template_str = str(call_template)
        if any(keyword in template_str.lower() for keyword in ['password', 'secret', 'key']):
            if not any(var in template_str for var in ['${', '${']):
                issues.append(f"Tool {tool['name']}: May contain hardcoded credentials")
        
        # Check for CLI security
        if call_template.get('call_template_type') == 'cli':
            command = call_template.get('command', '')
            if not command.startswith('/'):
                issues.append(f"Tool {tool['name']}: CLI command should use absolute path")
    
    return issues
```

## Security Checklist

### Tool Provider Security

- [ ] UTCP manual endpoint requires authentication
- [ ] All tool endpoints use HTTPS/WSS
- [ ] Input validation implemented for all tools
- [ ] Rate limiting configured per user/tool
- [ ] Security logging enabled
- [ ] Credentials stored securely (not hardcoded)
- [ ] SSL certificate validation enabled
- [ ] Appropriate timeouts configured
- [ ] Error messages don't leak sensitive information

### Tool Consumer Security

- [ ] Variable substitution is sanitized
- [ ] SSL certificate verification enabled
- [ ] Connection timeouts configured
- [ ] Rate limiting respected
- [ ] Security events logged
- [ ] Credentials rotated regularly
- [ ] Network connections monitored
- [ ] Input validation before tool calls

### Protocol-Specific Security

- [ ] **HTTP**: HTTPS only, certificate validation
- [ ] **WebSocket**: WSS only, origin validation
- [ ] **CLI**: Sandboxed execution, input sanitization
- [ ] **SSE**: Authenticated connections, event limits
- [ ] **Text**: Path validation, size limits
- [ ] **MCP**: Trusted servers, resource limits

By following these security guidelines, you can safely implement UTCP while maintaining strong security posture across all communication protocols.

For protocol-specific security details, see:
- [HTTP Security](./protocols/http.md#security-considerations)
- [WebSocket Security](./protocols/websocket.md#security-considerations)
- [CLI Security](./protocols/cli.md#security-considerations)
- [SSE Security](./protocols/sse.md#security-considerations)
- [Text Security](./protocols/text.md#security-considerations)
- [MCP Security](./protocols/mcp.md#security-considerations)
