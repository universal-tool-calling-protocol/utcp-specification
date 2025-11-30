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


**Implements A Weighted Scoring System That Matches Tools Based On**

1. Tag matches (higher weight)
2. Description word matches (lower weight)

The strategy normalizes queries to lowercase, extracts words using regex,
and calculates relevance scores for each tool. Results are sorted by
score in descending order.



**Attributes**

- **`tool_search_strategy_type`**: Always "tag_and_description_word_match".
- **`description_weight`**: Weight multiplier for description word matches (default: 1.0).
- **`tag_weight`**: Weight multiplier for tag matches (default: 3.0).



**Scoring Algorithm**

- Each matching tag contributes tag_weight points
- Each matching description word contributes description_weight points
- Tools with higher scores are ranked first
- Tools with zero score are included in results (ranked last)
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

*No class documentation available*

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
