---
title: tag_search
sidebar_label: tag_search
---

# tag_search

**File:** `core/src/utcp/implementations/tag_search.py`

### class TagAndDescriptionWordMatchStrategy ([ToolSearchStrategy](./../interfaces/tool_search_strategy.md#toolsearchstrategy)) {#taganddescriptionwordmatchstrategy}

<details>
<summary>Documentation</summary>

Tag and description word match strategy.

This strategy matches tools based on the presence of tags and words in the description.
</details>

#### Fields:

- tool_search_strategy_type: Literal['tag_and_description_word_match']
- description_weight: float
- tag_weight: float

#### Methods:

<details>
<summary>async search_tools(self, tool_repository: [ConcurrentToolRepository](./../interfaces/concurrent_tool_repository.md#concurrenttoolrepository), query: str, limit: int, any_of_tags_required: Optional[List[str]]) -> List[[Tool](./../data/tool.md#tool)]</summary>

Search for tools based on the given query.


**Args**

- **`tool_repository`**: The tool repository to search in.
- **`query`**: The query to search for.
- **`limit`**: The maximum number of results to return.
- **`any_of_tags_required`**: A list of tags that must be present in the tool.



**Returns**

A list of tools that match the query.
</details>

---

### class TagAndDescriptionWordMatchStrategyConfigSerializer ([Serializer](./../interfaces/serializer.md#serializer)[TagAndDescriptionWordMatchStrategy]) {#taganddescriptionwordmatchstrategyconfigserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../interfaces/serializer.md#serializer) for `TagAndDescriptionWordMatchStrategy`.

Converts a `TagAndDescriptionWordMatchStrategy` instance to a dictionary and vice versa.
</details>

#### Methods:

<details>
<summary>to_dict(self, obj: TagAndDescriptionWordMatchStrategy) -> dict</summary>

Convert a `TagAndDescriptionWordMatchStrategy` instance to a dictionary.


**Args**

- **`obj`**: The `TagAndDescriptionWordMatchStrategy` instance to convert.



**Returns**

A dictionary representing the `TagAndDescriptionWordMatchStrategy` instance.
</details>

<details>
<summary>validate_dict(self, data: dict) -> TagAndDescriptionWordMatchStrategy</summary>

Convert a dictionary to a `TagAndDescriptionWordMatchStrategy` instance.


**Args**

- **`data`**: The dictionary to convert.



**Returns**

A `TagAndDescriptionWordMatchStrategy` instance representing the dictionary.
</details>

---
