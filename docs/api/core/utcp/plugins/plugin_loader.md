---
title: plugin_loader
sidebar_label: plugin_loader
---

# plugin_loader

**File:** `core/src/utcp/plugins/plugin_loader.py`

### Function _load_plugins() {#_load_plugins}

<details>
<summary>Documentation</summary>

Load and register all built-in and external UTCP plugins.

Registers core serializers for authentication, variable loading, tool repositories,
search strategies, and post-processors. Also discovers and loads external plugins
through the 'utcp.plugins' entry point group.

This function is called automatically by ensure_plugins_initialized() and should
not be called directly.
</details>

---

### Function ensure_plugins_initialized() {#ensure_plugins_initialized}

<details>
<summary>Documentation</summary>

Ensure that plugins are initialized.

This function should be called before using any plugin related functionality is used.
</details>

---
