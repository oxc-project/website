<script setup lang="ts">
import { computed, ref, watch } from "vue";
// Import the generated rules data
import rules from "@data/rules.json" with { type: "json" };
import fixEmoji from "./utils/fixEmoji";

// Derive available filter options
const categories = computed(() => {
  const set = new Set(rules.map((r) => r.category));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const scopes = computed(() => {
  const set = new Set(rules.map((r) => r.scope));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

// Sorting and filtering state
type SortColumn = "name" | "source" | "category" | "default" | "fix";
type SortDirection = "asc" | "desc";

const allowedColumns = new Set(["name", "source", "category", "default", "fix"]);
const allowedDirs = new Set(["asc", "desc"]);

const sortColumn = ref<SortColumn>("name");
const sortDirection = ref<SortDirection>("asc");
const categoryFilter = ref("all");
const scopeFilter = ref("all");
const includeTypeAware = ref(true);
const hasFixOnly = ref(false);

const toggleSort = (column: SortColumn) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
};

const resetFilters = () => {
  // Workaround for VoidZero base button focus style issue
  (window.document.activeElement as HTMLButtonElement)?.blur();

  categoryFilter.value = "all";
  scopeFilter.value = "all";
  includeTypeAware.value = true;
  hasFixOnly.value = false;
};

const handleInitialQueryParams = () => {
  const params = new URLSearchParams(location.search);
  const sortKey = params.get("sort") ?? "name";
  const directionKey = params.get("dir") ?? "asc";
  const categoryKey = params.get("category") ?? "all";
  const scopeKey = params.get("scope") ?? "all";
  const typeAwareKey = params.get("type_aware");
  const hasFixKey = params.get("has_fix");

  if (sortKey && allowedColumns.has(sortKey)) {
    sortColumn.value = sortKey as SortColumn;
  }

  if (directionKey && allowedDirs.has(directionKey)) {
    sortDirection.value = directionKey as SortDirection;
  }

  if (categoryKey && categories.value.includes(categoryKey)) {
    categoryFilter.value = categoryKey;
  }

  if (scopeKey && scopes.value.includes(scopeKey)) {
    scopeFilter.value = scopeKey;
  }

  if (typeAwareKey !== null) {
    includeTypeAware.value = typeAwareKey !== "false";
  }

  if (hasFixKey !== null) {
    hasFixOnly.value = hasFixKey === "true";
  }
};

handleInitialQueryParams();

watch(
  [sortColumn, sortDirection, categoryFilter, scopeFilter, includeTypeAware, hasFixOnly],
  () => {
    const params = new URLSearchParams(location.search);
    params.set("sort", sortColumn.value);
    params.set("dir", sortDirection.value);

    if (categoryFilter.value !== "all") {
      params.set("category", categoryFilter.value);
    } else {
      params.delete("category");
    }

    if (scopeFilter.value !== "all") {
      params.set("scope", scopeFilter.value);
    } else {
      params.delete("scope");
    }

    if (!includeTypeAware.value) {
      params.set("type_aware", "false");
    } else {
      params.delete("type_aware");
    }

    if (hasFixOnly.value) {
      params.set("has_fix", "true");
    } else {
      params.delete("has_fix");
    }

    const searchParams = params.toString();
    const url = location.pathname + (searchParams ? `?${searchParams}` : "") + location.hash;

    history.replaceState(null, "", url);
  },
);

// Helpers
const hasFix = (fix: string) => {
  return !(fix === "none" || fix === "pending");
};

const fixTitle = (fix: string) => {
  switch (fix) {
    case "fixable_fix":
      return "Has automatic fix";
    case "conditional_fix":
      return "Has conditional automatic fix";
    case "fixable_suggestion":
      return "Has automatic suggestion";
    case "conditional_suggestion":
      return "Has conditional suggestion";
    case "fixable_dangerous_fix":
      return "Has dangerous automatic fix";
    case "conditional_dangerous_fix":
      return "Has conditional dangerous fix";
    case "fixable_dangerous_suggestion":
      return "Has dangerous suggestion";
    case "conditional_dangerous_suggestion":
      return "Has conditional dangerous suggestion";
    case "conditional_safe_fix_or_suggestion":
      return "Has conditional fix or suggestion";
    case "conditional_dangerous_fix_or_suggestion":
      return "Has conditional dangerous fix or suggestion";
    case "pending":
      return "Fix implementation pending";
    case "none":
    default:
      return "No fix available";
  }
};

// Apply filters and sorting to all rules
const filteredAndSorted = computed(() => {
  let filtered = rules.filter((r) => {
    if (categoryFilter.value !== "all" && r.category !== categoryFilter.value) {
      return false;
    }

    if (scopeFilter.value !== "all" && r.scope !== scopeFilter.value) {
      return false;
    }

    if (!includeTypeAware.value && r.type_aware) {
      return false;
    }

    if (hasFixOnly.value && !hasFix(r.fix)) {
      return false;
    }

    return true;
  });

  // Sort the filtered results
  return filtered.slice().sort((a, b) => {
    let comparison = 0;

    switch (sortColumn.value) {
      case "name":
        comparison = a.value.localeCompare(b.value);
        break;
      case "source": {
        comparison = a.scope.localeCompare(b.scope);
        if (comparison === 0) comparison = a.value.localeCompare(b.value);
        break;
      }
      case "category": {
        comparison = a.category.localeCompare(b.category);
        if (comparison === 0) comparison = a.value.localeCompare(b.value);
        break;
      }
      case "default": {
        const aDefault = a.default ? 1 : 0;
        const bDefault = b.default ? 1 : 0;
        comparison = bDefault - aDefault; // default rules first
        if (comparison === 0) comparison = a.value.localeCompare(b.value);
        break;
      }
      case "fix": {
        // sort by whether it has a fix or not,
        // and then by fix type alphabetically.
        const af = a.fix;
        const bf = b.fix;

        if (hasFix(af) && !hasFix(bf)) {
          comparison = 1;
        } else if (!hasFix(af) && hasFix(bf)) {
          comparison = -1;
        } else {
          comparison = af.localeCompare(bf);
        }

        break;
      }
    }

    return sortDirection.value === "asc" ? comparison : -comparison;
  });
});

// Map of plugin values to display names, e.g. jsx_a11y -> jsx-a11y
// This is only really needed for plugins that have names with underscores.
const pluginDisplayNames: Record<string, string> = {
  jsx_a11y: "jsx-a11y",
  react_perf: "react-perf",
};
</script>

<template>
  <div class="rules-controls">
    <div>
      <label for="categoryFilter"><strong>Category</strong></label>
      <select id="categoryFilter" v-model="categoryFilter">
        <option value="all">All</option>
        <!-- Display categories with the first letter capitalized. -->
        <option v-for="c in categories" :key="c" :value="c">
          {{ c.charAt(0).toUpperCase() + c.slice(1) }}
        </option>
      </select>
    </div>

    <div>
      <label for="scopeFilter"><strong>Source/Plugin</strong></label>
      <select id="scopeFilter" v-model="scopeFilter">
        <option value="all">All</option>
        <option v-for="s in scopes" :key="s" :value="s">{{ pluginDisplayNames[s] || s }}</option>
      </select>
    </div>

    <button type="button" class="button" @click="resetFilters">Reset filters</button>
  </div>

  <div class="rules-checkboxes">
    <label>
      <input type="checkbox" v-model="includeTypeAware" />
      Include type-aware rules
    </label>
    <label>
      <input type="checkbox" v-model="hasFixOnly" />
      Has fix available
    </label>
  </div>

  <table>
    <thead>
      <tr>
        <th
          @click="toggleSort('name')"
          @keydown.enter="toggleSort('name')"
          @keydown.space.prevent="toggleSort('name')"
          tabindex="0"
          class="sortable"
        >
          Rule name
          <span v-if="sortColumn === 'name'" class="sort-indicator">
            {{ sortDirection === "asc" ? "▲" : "▼" }}
          </span>
        </th>
        <th
          @click="toggleSort('source')"
          @keydown.enter="toggleSort('source')"
          @keydown.space.prevent="toggleSort('source')"
          tabindex="0"
          class="sortable"
        >
          Source
          <span v-if="sortColumn === 'source'" class="sort-indicator">
            {{ sortDirection === "asc" ? "▲" : "▼" }}
          </span>
        </th>
        <th
          @click="toggleSort('category')"
          @keydown.enter="toggleSort('category')"
          @keydown.space.prevent="toggleSort('category')"
          tabindex="0"
          class="sortable"
        >
          Category
          <span v-if="sortColumn === 'category'" class="sort-indicator">
            {{ sortDirection === "asc" ? "▲" : "▼" }}
          </span>
        </th>
        <th
          @click="toggleSort('default')"
          @keydown.enter="toggleSort('default')"
          @keydown.space.prevent="toggleSort('default')"
          tabindex="0"
          class="sortable"
        >
          Default
          <span v-if="sortColumn === 'default'" class="sort-indicator">
            {{ sortDirection === "asc" ? "▲" : "▼" }}
          </span>
        </th>
        <th
          @click="toggleSort('fix')"
          @keydown.enter="toggleSort('fix')"
          @keydown.space.prevent="toggleSort('fix')"
          tabindex="0"
          class="sortable"
        >
          Fixable?
          <span v-if="sortColumn === 'fix'" class="sort-indicator">
            {{ sortDirection === "asc" ? "▲" : "▼" }}
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="r in filteredAndSorted" :key="`${r.scope}:${r.value}`">
        <td>
          <a :href="`/docs/guide/usage/linter/rules/${r.scope}/${r.value}`">{{ r.value }}</a>
          <span v-if="r.type_aware" title="Type-aware rule" style="margin-left: 0.4rem">💭</span>
        </td>
        <td>{{ pluginDisplayNames[r.scope] || r.scope }}</td>
        <td>{{ r.category }}</td>
        <td style="text-align: center" v-if="r.default"><span title="Default enabled">✅</span></td>
        <td v-else></td>
        <td style="text-align: center" :title="fixTitle(r.fix)">{{ fixEmoji(r.fix) }}</td>
      </tr>
      <tr v-if="filteredAndSorted.length === 0">
        <td colspan="5" style="opacity: 0.7">No rules match current filters.</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.9rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

select:hover {
  border-color: var(--vp-c-brand-1);
}

select:focus {
  outline: none;
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

input[type="checkbox"]:focus {
  outline: 1px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.rules-controls {
  margin: 1rem 0;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: minmax(220px, 1fr) minmax(220px, 1fr) auto;
  align-items: end;
}

@media (width <= 640px) {
  .rules-controls {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
}

.rules-checkboxes {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.75rem;
  align-items: center;
}

.rules-checkboxes label {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
}

.sortable {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.sortable:hover {
  background-color: var(--vp-c-bg-soft);
}

.sortable:focus {
  outline: 1px solid var(--vp-c-brand-1);
  outline-offset: -1px;
  background-color: var(--vp-c-bg-soft);
}

.sort-indicator {
  margin-left: 0.25rem;
  font-size: 0.75em;
}
</style>
