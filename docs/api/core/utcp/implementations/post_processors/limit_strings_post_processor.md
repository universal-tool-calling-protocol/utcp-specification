---
title: limit_strings_post_processor
sidebar_label: limit_strings_post_processor
---

# limit_strings_post_processor

**File:** `core/src/utcp/implementations/post_processors/limit_strings_post_processor.py`

### class LimitStringsPostProcessor ([ToolPostProcessor](./../../interfaces/tool_post_processor.md#toolpostprocessor)) {#limitstringspostprocessor}

<details>
<summary>Documentation</summary>

Post-processor that limits the length of string values in tool results.

Truncates string values to a specified maximum length to prevent
excessively large responses. Processes nested dictionaries and lists
recursively. Can be configured to apply limiting only to specific
tools or manuals.


**Attributes**

- **`tool_post_processor_type`**: Always "limit_strings" for this processor.
- **`limit`**: Maximum length for string values (default: 10000 characters).
- **`exclude_tools`**: List of tool names to skip processing for.
- **`only_include_tools`**: List of tool names to process (all others skipped).
- **`exclude_manuals`**: List of manual names to skip processing for.
- **`only_include_manuals`**: List of manual names to process (all others skipped).
</details>

#### Fields:

- tool_post_processor_type: Literal['limit_strings']
- limit: int
- exclude_tools: Optional[List[str]]
- only_include_tools: Optional[List[str]]
- exclude_manuals: Optional[List[str]]
- only_include_manuals: Optional[List[str]]

---

### class LimitStringsPostProcessorConfigSerializer ([Serializer](./../../interfaces/serializer.md#serializer)[LimitStringsPostProcessor]) {#limitstringspostprocessorconfigserializer}

*No class documentation available*

---
