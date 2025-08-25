---
title: register_manual_response
sidebar_label: register_manual_response
---

# register_manual_response

**File:** `core/src/utcp/data/register_manual_response.py`

### class RegisterManualResult {#registermanualresult}

<details>
<summary>Documentation</summary>

Result of a manual registration.


**Attributes**

- **`manual_call_template`**: The call template of the registered manual.
- **`manual`**: The registered manual.
- **`success`**: Whether the registration was successful.
- **`errors`**: List of error messages if registration failed.
</details>

#### Fields:

- manual_call_template: [CallTemplate](./call_template.md#calltemplate)
- manual: [UtcpManual](./utcp_manual.md#utcpmanual)
- success: bool
- errors: List[str]

---
