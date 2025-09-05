---
title: oauth2_auth
sidebar_label: oauth2_auth
---

# oauth2_auth

**File:** `core/src/utcp/data/auth_implementations/oauth2_auth.py`

### class OAuth2Auth ([Auth](./../auth.md#auth)) {#oauth2auth}

<details>
<summary>Documentation</summary>

Authentication using OAuth2 client credentials flow.

Implements the OAuth2 client credentials grant type for machine-to-machine
authentication. The client automatically handles token acquisition and refresh.


**Attributes**

- **`auth_type`**: The authentication type identifier, always "oauth2".
- **`token_url`**: The URL endpoint to fetch the OAuth2 access token from. Recommended to use injected variables.
- **`client_id`**: The OAuth2 client identifier. Recommended to use injected variables.
- **`client_secret`**: The OAuth2 client secret. Recommended to use injected variables.
- **`scope`**: Optional scope parameter to limit the access token's permissions.
</details>

#### Fields:

- auth_type: Literal['oauth2']
- token_url: str
- client_id: str
- client_secret: str
- scope: Optional[str]

---

### class OAuth2AuthSerializer ([Serializer](./../../interfaces/serializer.md#serializer)[OAuth2Auth]) {#oauth2authserializer}

Serializer for OAuth2Auth configuration and token management.

#### Methods:

<details>
<summary>to_dict(self, obj: OAuth2Auth) -> dict</summary>

Convert an OAuth2Auth object to a dictionary.


**Args**

- **`obj`**: The OAuth2Auth object to convert.



**Returns**

The dictionary converted from the OAuth2Auth object.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> OAuth2Auth</summary>

Validate a dictionary and convert it to an OAuth2Auth object.


**Args**

- **`obj`**: The dictionary to validate and convert.



**Returns**

The OAuth2Auth object converted from the dictionary.
</details>

---
