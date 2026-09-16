---
title: utcp_protocol_close_error
sidebar_label: utcp_protocol_close_error
---

# utcp_protocol_close_error

**File:** `core/src/utcp/exceptions/utcp_protocol_close_error.py`

### class UtcpProtocolCloseError {#utcpprotocolcloseerror}

<details>
<summary>Documentation</summary>

Raised when one or more of a client's own protocol instances failed to close.

Every instance is still asked to close before this is raised, so nothing is
left half-torn-down behind it; `failures` carries what each failing close raised.
</details>

---
