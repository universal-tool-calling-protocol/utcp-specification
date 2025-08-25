---
title: tool_search_strategy
sidebar_label: tool_search_strategy
---

# tool_search_strategy

**File:** `core/src/utcp/interfaces/tool_search_strategy.py`

### class ToolSearchStrategy {#toolsearchstrategy}

<details>
<summary>Documentation</summary>

Abstract interface for tool search implementations.

Defines the contract for tool search strategies that can be plugged into
the UTCP client. Different implementations can provide various search
algorithms such as tag-based matching, semantic similarity, or keyword
search.


**Search Strategies Are Responsible For**

- Interpreting search queries
- Ranking tools by relevance
- Limiting results appropriately
- Providing consistent search behavior
</details>

#### Fields:

- tool_search_strategy_type: str

#### Methods:

<details>
<summary>async search_tools(self, tool_repository: [ConcurrentToolRepository](./concurrent_tool_repository.md#concurrenttoolrepository), query: str, limit: int, any_of_tags_required: Optional[List[str]]) -> List[[Tool](./../data/tool.md#tool)]</summary>

Search for tools relevant to the query.

Executes a search against the available tools and returns the most
relevant matches ranked by the strategy's scoring algorithm.


**Args**

- **`tool_repository`**: The tool repository to search within.
- **`query`**: The search query string. Format depends on the strategy
  (e.g., keywords, tags, natural language).
- **`limit`**: Maximum number of tools to return. Use 0 for no limit.
  Strategies should respect this limit for performance.
- **`any_of_tags_required`**: Optional list of tags where one of them must be present in the tool's tags
  for it to be considered a match.



**Returns**

List of [Tool](./../data/tool.md#tool) objects ranked by relevance, limited to the
specified count. Empty list if no matches found.



**Raises**

- **`ValueError`**: If the query format is invalid for this strategy.
- **`RuntimeError`**: If the search operation fails unexpectedly.
</details>

---

### class ToolSearchStrategyConfigSerializer ([Serializer](./serializer.md#serializer)[ToolSearchStrategy]) {#toolsearchstrategyconfigserializer}

<details>
<summary>Documentation</summary>

[Serializer](./serializer.md#serializer) for tool search strategies.

Defines the contract for serializers that convert tool search strategies to and from

**Dictionaries For Storage Or Transmission. Serializers Are Responsible For**

- Converting tool search strategies to dictionaries for storage or transmission
- Converting dictionaries back to tool search strategies
- Ensuring data consistency during serialization and deserialization
</details>

#### Fields:

- tool_search_strategy_implementations: Dict[str, [Serializer](./serializer.md#serializer)['ToolSearchStrategy']]
- `default_strategy`

#### Methods:

<details>
<summary>to_dict(self, obj: ToolSearchStrategy) -> dict</summary>

Convert a tool search strategy to a dictionary.


**Args**

- **`obj`**: The tool search strategy to convert.



**Returns**

The dictionary converted from the tool search strategy.
</details>

<details>
<summary>validate_dict(self, data: dict) -> ToolSearchStrategy</summary>

Validate a dictionary and convert it to a tool search strategy.


**Args**

- **`data`**: The dictionary to validate and convert.



**Returns**

The tool search strategy converted from the dictionary.
</details>

---
