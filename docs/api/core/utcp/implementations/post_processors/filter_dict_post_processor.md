---
title: filter_dict_post_processor
sidebar_label: filter_dict_post_processor
---

# filter_dict_post_processor

**File:** `core/src/utcp/implementations/post_processors/filter_dict_post_processor.py`

### class FilterDictPostProcessor ([ToolPostProcessor](./../../interfaces/tool_post_processor.md#toolpostprocessor)) {#filterdictpostprocessor}

<details>
<summary>Documentation</summary>

Post-processor that filters dictionary keys from tool results.

Provides flexible filtering capabilities to include or exclude specific keys
from dictionary results, with support for nested dictionaries and lists.
Can be configured to apply filtering only to specific tools or manuals.


**Attributes**

- **`tool_post_processor_type`**: Always "filter_dict" for this processor.
- **`exclude_keys`**: List of keys to remove from dictionary results.
- **`only_include_keys`**: List of keys to keep in dictionary results (all others removed).
- **`exclude_tools`**: List of tool names to skip processing for.
- **`only_include_tools`**: List of tool names to process (all others skipped).
- **`exclude_manuals`**: List of manual names to skip processing for.
- **`only_include_manuals`**: List of manual names to process (all others skipped).
</details>

#### Fields:

- tool_post_processor_type: Literal['filter_dict']
- exclude_keys: Optional[List[str]]
- only_include_keys: Optional[List[str]]
- exclude_tools: Optional[List[str]]
- only_include_tools: Optional[List[str]]
- exclude_manuals: Optional[List[str]]
- only_include_manuals: Optional[List[str]]

---

### class FilterDictPostProcessorConfigSerializer ([Serializer](./../../interfaces/serializer.md#serializer)[FilterDictPostProcessor]) {#filterdictpostprocessorconfigserializer}

*No class documentation available*

---
