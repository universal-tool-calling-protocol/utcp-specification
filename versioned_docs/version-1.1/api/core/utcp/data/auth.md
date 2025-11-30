---
title: auth
sidebar_label: auth
---

# auth

**File:** `core/src/utcp/data/auth.py`

### class Auth {#auth}

<details>
<summary>Documentation</summary>

Authentication details for a provider.


**Attributes**

- **`auth_type`**: The authentication type identifier.
</details>

#### Fields:

- auth_type: str

---

### class AuthSerializer ([Serializer](./../interfaces/serializer.md#serializer)[Auth]) {#authserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../interfaces/serializer.md#serializer) for authentication details.

Defines the contract for serializers that convert authentication details to and from

**Dictionaries For Storage Or Transmission. Serializers Are Responsible For**

- Converting authentication details to dictionaries for storage or transmission
- Converting dictionaries back to authentication details
- Ensuring data consistency during serialization and deserialization
</details>

#### Fields:

- auth_serializers: dict[str, [Serializer](./../interfaces/serializer.md#serializer)[Auth]]

#### Methods:

<details>
<summary>to_dict(self, obj: Auth) -> dict</summary>

Convert an Auth object to a dictionary.


**Args**

- **`obj`**: The Auth object to convert.



**Returns**

The dictionary converted from the Auth object.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> Auth</summary>

Validate a dictionary and convert it to an Auth object.


**Args**

- **`obj`**: The dictionary to validate and convert.



**Returns**

The Auth object converted from the dictionary.
</details>

---
