---
title: basic_auth
sidebar_label: basic_auth
---

# basic_auth

**File:** `core/src/utcp/data/auth_implementations/basic_auth.py`

### class BasicAuth ([Auth](./../auth.md#auth)) {#basicauth}

<details>
<summary>Documentation</summary>

Authentication using HTTP Basic Authentication.

Uses the standard HTTP Basic Authentication scheme with username and password
encoded in the Authorization header.


**Attributes**

- **`auth_type`**: The authentication type identifier, always "basic".
- **`username`**: The username for basic authentication. Recommended to use injected variables.
- **`password`**: The password for basic authentication. Recommended to use injected variables.
</details>

#### Fields:

- auth_type: Literal['basic']
- username: str
- password: str

---

### class BasicAuthSerializer ([Serializer](./../../interfaces/serializer.md#serializer)[BasicAuth]) {#basicauthserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../../interfaces/serializer.md#serializer) for BasicAuth model.
</details>

#### Methods:

<details>
<summary>to_dict(self, obj: BasicAuth) -> dict</summary>

Convert a BasicAuth object to a dictionary.


**Args**

- **`obj`**: The BasicAuth object to convert.



**Returns**

The dictionary converted from the BasicAuth object.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> BasicAuth</summary>

Validate a dictionary and convert it to a BasicAuth object.


**Args**

- **`obj`**: The dictionary to validate and convert.



**Returns**

The BasicAuth object converted from the dictionary.
</details>

---
