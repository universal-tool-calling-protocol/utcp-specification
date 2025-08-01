---
sidebar_position: 1
---
sidebar_position: 1
---
sidebar_position: 1
---

# HTTP Provider

The HTTP provider enables UTCP to interact with standard RESTful HTTP/HTTPS APIs, which are the most common type of web service.

## Configuration

HTTP providers are configured using the following JSON structure:

```json
{
  "name": "my_rest_api",
  "provider_type": "http",
  "url": "https://api.example.com/endpoint",
  "http_method": "POST",
  "content_type": "application/json",
  "auth": {
    "auth_type": "api_key",
    "api_key": "YOUR_API_KEY",
    "var_name": "X-API-Key"
  },
  "headers": {
    "X-Custom-Header": "custom_value"
  },
  "body_field": "request_body",
  "header_fields": ["user_id"]
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"http"` |
| `url` | Yes | Full URL to the API endpoint |
| `http_method` | No | HTTP method to use (default: `"GET"`). Can be `GET`, `POST`, `PUT`, `DELETE`, or `PATCH`. |
| `content_type` | No | Content type header (default: `"application/json"`) |
| `auth` | No | Authentication configuration (if required) |
| `headers` | No | A dictionary of static headers to include in every request. |
| `body_field`| No | The name of a single input field to be sent as the raw request body. If not provided, all inputs are sent as a JSON object. |
| `header_fields`| No | A list of input fields to be sent as request headers instead of in the body or query string. |

## Tool Discovery

For HTTP providers, the tool discovery endpoint should be accessible at `/utcp` on the same domain as the API. For example:

```
https://api.example.com/utcp
```

The discovery endpoint should return a `UTCPManual` object as described in the [For Tool Providers](../for-tool-providers) section.

## Authentication Options

HTTP providers support several authentication methods:

### API Key Authentication

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "$YOUR_API_KEY",
    "var_name": "X-API-Key"
  }
}
```

The API key will be sent as a header with the name specified in `var_name`.

### Basic Authentication

```json
{
  "auth": {
    "auth_type": "basic",
    "username": "user",
    "password": "pass"
  }
}
```

The username and password will be encoded and sent in the `Authorization` header.

### OAuth2 Authentication

```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "$YOUR_CLIENT_ID",
    "client_secret": "$YOUR_CLIENT_SECRET",
    "token_url": "https://auth.example.com/token"
  }
}
```

The client will handle obtaining and refreshing OAuth2 tokens.

## Making Tool Calls

When a tool associated with an HTTP provider is called, the UTCP client will:

1. Construct an HTTP request to the specified URL
2. Use the specified HTTP method (or default to POST)
3. Set the content type header (or default to application/json)
4. Add authentication headers if specified
5. Send the tool parameters in the request body (for POST/PUT) or as query parameters (for GET)
6. Parse the response according to the tool's output schema

## Examples

### Simple GET Request

```json
{
  "name": "weather_api",
  "provider_type": "http",
  "url": "https://api.weather.com/forecast",
  "http_method": "GET"
}
```

When calling a tool with this provider, parameters would be sent as query parameters:
```
GET https://api.weather.com/forecast?location=San%20Francisco&days=5
```

### POST Request with API Key

```json
{
  "name": "translation_api",
  "provider_type": "http",
  "url": "https://api.translation.com/translate",
  "http_method": "POST",
  "content_type": "application/json",
  "auth": {
    "auth_type": "api_key",
    "api_key": "abcd1234",
    "var_name": "X-API-Key"
  }
}
```

When calling a tool with this provider, parameters would be sent in the request body:
```
POST https://api.translation.com/translate
Header: X-API-Key: abcd1234
Body: {"text": "Hello world", "target_language": "es"}
```

### Advanced Usage: `body_field` and `header_fields`

You can use `body_field` to send a single parameter as the raw request body, and `header_fields` to map tool inputs to HTTP headers.

```json
{
  "name": "file_upload_api",
  "provider_type": "http",
  "url": "https://api.example.com/upload",
  "http_method": "POST",
  "content_type": "text/plain",
  "body_field": "file_content",
  "header_fields": ["X-File-Name", "X-User-ID"]
}
```

If a tool with this provider is called with inputs `{"file_content": "...", "X-File-Name": "report.txt", "X-User-ID": "user123"}` the request would be:

```
POST https://api.example.com/upload
Header: X-File-Name: report.txt
Header: X-User-ID: user123
Body: ... (raw content of file_content)
```

## Best Practices

1. **Use HTTPS**: Always use HTTPS URLs for security
2. **Handle Rate Limits**: Implement rate limiting and backoff strategies
3. **Validate Responses**: Check HTTP status codes and implement appropriate error handling
4. **Cache Results**: For GET requests, consider caching responses when appropriate
5. **Parameter Validation**: Validate parameters against the tool's input schema before sending

## Common Issues

| Issue | Solution |
|-------|----------|
| Connection timeouts | Implement retry logic with exponential backoff |
| Rate limiting | Honor API rate limits and implement backoff strategies |
| Authentication failures | Verify credentials and check for token expiration |
| CORS issues | Ensure the API supports CORS if called from a browser |

In the next section, we'll explore the [SSE Provider](sse) for server-sent events, which enables streaming responses from HTTP endpoints.
