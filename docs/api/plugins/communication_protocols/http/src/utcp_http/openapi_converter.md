---
title: openapi_converter
sidebar_label: openapi_converter
---

# openapi_converter

**File:** `plugins/communication_protocols/http/src/utcp_http/openapi_converter.py`

### class OpenApiConverter {#openapiconverter}

<details>
<summary>Documentation</summary>

Converts OpenAPI specifications into UTCP tool definitions.

Processes OpenAPI 2.0 and 3.0 specifications to generate equivalent UTCP
tools, handling schema resolution, authentication mapping, and proper
HTTP call_template configuration. Each operation in the OpenAPI spec becomes
a UTCP tool with appropriate input/output schemas.


**Features**

- Complete OpenAPI specification parsing.
- Recursive JSON reference ($ref) resolution.
- Authentication scheme conversion (API key, Basic, OAuth2).
- Input parameter and request body handling.
- Response schema extraction.
- URL template and path parameter support.
- Call template name normalization.
- Placeholder variable generation for configuration.



**Basic Openapi Conversion**

```python
    from utcp_http.openapi_converter import OpenApiConverter

    # Assuming you have a method to fetch and parse the spec
    openapi_spec = fetch_and_parse_spec("https://api.example.com/openapi.json")

    converter = OpenApiConverter(openapi_spec)
    manual = converter.convert()

    # Use the generated manual with a UTCP client
    # client = await UtcpClient.create()
    # await client.register_manual(manual)
```



**Converting Local Openapi File**

```python
    import yaml

    converter = OpenApiConverter()


**With Open("Api_Spec.Yaml", "R") As F**

spec_content = yaml.safe_load(f)

converter = OpenApiConverter(spec_content)
manual = converter.convert()
```



**Architecture**

The converter works by iterating through all paths and operations
in the OpenAPI spec, extracting relevant information for each
operation, and creating corresponding UTCP tools with HTTP call_templates.



**Attributes**

- **`spec`**: The parsed OpenAPI specification dictionary.
- **`spec_url`**: Optional URL where the specification was retrieved from.
- **`placeholder_counter`**: Counter for generating unique placeholder variables.
- **`call_template_name`**: Normalized name for the call_template derived from the spec.
</details>

#### Methods:

<details>
<summary>convert(self) -> [UtcpManual](./../../../../../core/utcp/data/utcp_manual.md#utcpmanual)</summary>

Converts the loaded OpenAPI specification into a [UtcpManual](./../../../../../core/utcp/data/utcp_manual.md#utcpmanual).

This is the main entry point for the conversion process. It iterates through
the paths and operations in the specification, creating a UTCP tool for each
one.


**Returns**

A [UtcpManual](./../../../../../core/utcp/data/utcp_manual.md#utcpmanual) object containing all the tools generated from the spec.
</details>

---
