---
title: utcp_manual
sidebar_label: utcp_manual
---

# utcp_manual

**File:** `core/src/utcp/data/utcp_manual.py`

### class UtcpManual {#utcpmanual}

<details>
<summary>Documentation</summary>

Standard format for tool provider responses during discovery.

Represents the complete set of tools available from a provider, along
with version information for compatibility checking. This format is
returned by tool providers when clients query for available tools
(e.g., through the `/utcp` endpoint or similar discovery mechanisms).

The manual serves as the authoritative source of truth for what tools
a provider offers and how they should be invoked.


**Attributes**

- **`version`**: UTCP protocol version supported by the provider.
  Defaults to the current library version.
- **`tools`**: List of available tools with their complete configurations
  including input/output schemas, descriptions, and metadata.



**Example**

```python
    @utcp_tool


**Def Tool1()**

pass

@utcp_tool


**Def Tool2()**

pass

# Create a manual from registered tools
manual = UtcpManual.create_from_decorators()

# Manual with specific tools
manual = UtcpManual.create_from_decorators(
manual_version="1.0.0",
exclude=["tool1"]
)
```
</details>

#### Fields:

- utcp_version: str
- manual_version: str
- tools: List[[Tool](./tool.md#tool)]

---

### class UtcpManualSerializer ([Serializer](./../interfaces/serializer.md#serializer)[UtcpManual]) {#utcpmanualserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../interfaces/serializer.md#serializer) for UtcpManual model.
</details>

#### Methods:

<details>
<summary>to_dict(self, obj: UtcpManual) -> dict</summary>

Convert a UtcpManual object to a dictionary.


**Args**

- **`obj`**: The UtcpManual object to convert.



**Returns**

The dictionary converted from the UtcpManual object.
</details>

<details>
<summary>validate_dict(self, data: dict) -> UtcpManual</summary>

Validate a dictionary and convert it to a UtcpManual object.


**Args**

- **`data`**: The dictionary to validate and convert.



**Returns**

The UtcpManual object converted from the dictionary.
</details>

---
