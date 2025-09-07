---
title: utcp_serializer_validation_error
sidebar_label: utcp_serializer_validation_error
---

# utcp_serializer_validation_error

**File:** `core/src/utcp/exceptions/utcp_serializer_validation_error.py`

### class UtcpSerializerValidationError {#utcpserializervalidationerror}

<details>
<summary>Documentation</summary>

Exception raised when a serializer validation fails.

Thrown by serializers when they cannot validate or convert data structures
due to invalid format, missing required fields, or type mismatches.
Contains the original validation error details for debugging.


**Usage**

Typically caught when loading configuration files or processing
external data that doesn't conform to UTCP specifications.
</details>

---
