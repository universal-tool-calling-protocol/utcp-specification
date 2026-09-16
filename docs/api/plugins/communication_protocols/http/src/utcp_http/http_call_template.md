---
title: http_call_template
sidebar_label: http_call_template
---

# http_call_template

**File:** `plugins/communication_protocols/http/src/utcp_http/http_call_template.py`

### class HttpCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#httpcalltemplate}

<details>
<summary>Documentation</summary>

Provider configuration for HTTP-based tools.

Supports RESTful HTTP/HTTPS APIs with various HTTP methods, authentication,
custom headers, and flexible request/response handling. Supports URL path
parameters using \{parameter_name\} syntax. All tool arguments not mapped to
URL body, headers or query pattern parameters are passed as query parameters using '?arg_name=\{arg_value\}'.


**Configuration Examples**

Basic HTTP GET request:
```json
    {
      "name": "my_rest_api",
      "call_template_type": "http",
      "url": "https://api.example.com/users/{user_id}",
      "http_method": "GET"
    }
```

POST with authentication:
```json
    {
      "name": "secure_api",
      "call_template_type": "http",
      "url": "https://api.example.com/users",
      "http_method": "POST",
      "content_type": "application/json",
      "auth": {
        "auth_type": "api_key",
        "api_key": "Bearer ${API_KEY}",
        "var_name": "Authorization",
        "location": "header"
      },
      "auth_tools": {
        "auth_type": "api_key",
        "api_key": "Bearer ${TOOL_API_KEY}",
        "var_name": "Authorization",
        "location": "header"
      },
      "headers": {
        "X-Custom-Header": "value"
      },
      "body_field": "body",
      "header_fields": ["user_id"]
    }
```

OAuth2 authentication:
```json
    {
      "name": "oauth_api",
      "call_template_type": "http",
      "url": "https://api.example.com/data",
      "http_method": "GET",
      "auth": {
        "auth_type": "oauth2",
        "client_id": "${CLIENT_ID}",
        "client_secret": "${CLIENT_SECRET}",
        "token_url": "https://auth.example.com/token"
      }
    }
```

Basic authentication:
```json
    {
      "name": "basic_auth_api",
      "call_template_type": "http",
      "url": "https://api.example.com/secure",
      "http_method": "GET",
      "auth": {
        "auth_type": "basic",
        "username": "${USERNAME}",
        "password": "${PASSWORD}"
      }
    }
```



**Attributes**

- **`call_template_type`**: Always "http" for HTTP providers.
- **`http_method`**: The HTTP method to use for requests.
- **`url`**: The base URL for the HTTP endpoint. Supports path parameters like
  "https://api.example.com/users/{user_id}/posts/{post_id}".
- **`content_type`**: The Content-Type header for requests.
- **`auth`**: Optional authentication configuration for accessing the OpenAPI spec URL.
- **`auth_tools`**: Optional authentication configuration for generated tools. Applied only to endpoints requiring auth per OpenAPI spec.
- **`headers`**: Optional static headers to include in all requests.
- **`body_field`**: Name of the tool argument to map to the HTTP request body.
- **`header_fields`**: List of tool argument names to map to HTTP request headers.
</details>

#### Fields:

- call_template_type: Literal['http']
- http_method: Literal['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
- url: str
- content_type: str
- auth: Optional[[Auth](./../../../../../core/utcp/data/auth.md#auth)]
- auth_tools: Optional[[Auth](./../../../../../core/utcp/data/auth.md#auth)]
- headers: Optional[Dict[str, str]]
- body_field: Optional[str]
- header_fields: Optional[List[str]]

---

### class HttpCallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[HttpCallTemplate]) {#httpcalltemplateserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer) for HttpCallTemplate.
</details>

#### Methods:

<details>
<summary>to_dict(self, obj: HttpCallTemplate) -> dict</summary>

Convert HttpCallTemplate to dictionary.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> HttpCallTemplate</summary>

Validate dictionary and convert to HttpCallTemplate.
</details>

---
