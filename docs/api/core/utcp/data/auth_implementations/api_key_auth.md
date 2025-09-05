---
title: api_key_auth
sidebar_label: api_key_auth
---

# api_key_auth

**File:** `core/src/utcp/data/auth_implementations/api_key_auth.py`

### class ApiKeyAuth ([Auth](./../auth.md#auth)) {#apikeyauth}

<details>
<summary>Documentation</summary>

Authentication using an API key.

The key can be provided directly or sourced from an environment variable.
Supports placement in headers, query parameters, or cookies.


**Attributes**

- **`auth_type`**: The authentication type identifier, always "api_key".
- **`api_key`**: The API key for authentication. Values starting with '$' or formatted as '$\{\}' are
  treated as an injected variable from environment or configuration.
- **`var_name`**: The name of the header, query parameter, or cookie that
  contains the API key.
- **`location`**: Where to include the API key (header, query parameter, or cookie).
</details>

#### Fields:

- auth_type: Literal['api_key']
- api_key: str
- var_name: str
- location: Literal['header', 'query', 'cookie']

---

### class ApiKeyAuthSerializer ([Serializer](./../../interfaces/serializer.md#serializer)[ApiKeyAuth]) {#apikeyauthserializer}

Serializer for ApiKeyAuth configuration and credentials.

#### Methods:

<details>
<summary>to_dict(self, obj: ApiKeyAuth) -> dict</summary>

Convert an ApiKeyAuth object to a dictionary.


**Args**

- **`obj`**: The ApiKeyAuth object to convert.



**Returns**

The dictionary converted from the ApiKeyAuth object.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> ApiKeyAuth</summary>

Validate a dictionary and convert it to an ApiKeyAuth object.


**Args**

- **`obj`**: The dictionary to validate and convert.



**Returns**

The ApiKeyAuth object converted from the dictionary.
</details>

---
