<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import { compatData } from "@data/compat";
import type { Framework, FrameworkCategory, SupportLevel, SupportStatus, Tool } from "@data/compat";
import type { Source } from "@data/compat/types";

const { frameworks, tools, statusConfigList, getCellData } = useCompatData();

const {
  searchQuery,
  selectedCategory,
  hasActiveFilters,
  resetFilters,
  toggleStatus,
  isStatusSelected,
  filteredFrameworks,
  groupedFrameworks,
} = useFilters(frameworks, tools, getCellData);

const { footnoteData, getFootnoteRef, formatFrameworkNames } = useFootnotes(
  filteredFrameworks,
  tools,
  getCellData,
);

const activeTooltip = ref<string | null>(null);

const categories: { id: FrameworkCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "base", label: "Base" },
  { id: "frontend", label: "Frontend" },
  { id: "meta-framework", label: "Meta-Frameworks" },
  { id: "file-type", label: "File Types" },
];

const categoryLabels: Record<FrameworkCategory, string> = {
  base: "Base",
  frontend: "Frontend Frameworks",
  "meta-framework": "Meta-Frameworks",
  "file-type": "File Types",
};

interface StatusConfig {
  label: string;
  icon: string;
  colorClass: string;
  textClass: string;
}

interface CellData {
  status: SupportStatus;
  config: StatusConfig;
}

function useCompatData() {
  const frameworks = compatData.frameworks;
  const tools = compatData.tools;

  const statusConfigMap: Record<SupportLevel, StatusConfig> = {
    full: {
      label: "Full Support",
      icon: "mdi:check-circle",
      colorClass: "bg-[#22c55e]",
      textClass: "text-white",
    },
    partial: {
      label: "Partial",
      icon: "mdi:alert-circle",
      colorClass: "bg-[#eab308]",
      textClass: "text-black",
    },
    none: {
      label: "Not Supported",
      icon: "mdi:close-circle",
      colorClass: "bg-[#ef4444]",
      textClass: "text-white",
    },
    "n/a": {
      label: "Out of Scope",
      icon: "mdi:minus-circle",
      colorClass: "bg-[#6b7280]",
      textClass: "text-white",
    },
  };

  const statusConfigList = (["full", "partial", "none", "n/a"] as SupportLevel[]).map((level) => ({
    level,
    ...statusConfigMap[level],
  }));

  const statusMap = new Map<string, SupportStatus>();
  for (const entry of compatData.entries) {
    statusMap.set(`${entry.frameworkId}-${entry.toolId}-${entry.featureId}`, entry.status);
  }

  const defaultStatus: SupportStatus = { level: "n/a" };
  const cellDataMap = new Map<string, CellData>();
  for (const framework of frameworks) {
    for (const tool of tools) {
      const status =
        statusMap.get(`${framework.id}-${tool.id}-${tool.features[0].id}`) ?? defaultStatus;
      cellDataMap.set(`${framework.id}-${tool.id}`, {
        status,
        config: statusConfigMap[status.level],
      });
    }
  }

  function getCellData(frameworkId: string, toolId: string): CellData {
    return cellDataMap.get(`${frameworkId}-${toolId}`)!;
  }

  return { frameworks, tools, statusConfigList, getCellData };
}

function useFilters(
  frameworks: Framework[],
  tools: Tool[],
  getCellData: (fId: string, tId: string) => CellData,
) {
  const searchQuery = ref("");
  const selectedCategory = ref<FrameworkCategory | "all">("all");
  const selectedStatuses = ref<SupportLevel[]>([]);

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value || selectedCategory.value !== "all" || selectedStatuses.value.length > 0
    );
  });

  function resetFilters() {
    searchQuery.value = "";
    selectedCategory.value = "all";
    selectedStatuses.value = [];
  }

  function toggleStatus(level: SupportLevel) {
    const idx = selectedStatuses.value.indexOf(level);
    if (idx === -1) {
      selectedStatuses.value = [...selectedStatuses.value, level];
    } else {
      selectedStatuses.value = selectedStatuses.value.filter((s) => s !== level);
    }
  }

  function isStatusSelected(level: SupportLevel): boolean {
    return selectedStatuses.value.length === 0 || selectedStatuses.value.includes(level);
  }

  const filteredFrameworks = computed(() => {
    let result = frameworks;

    if (selectedCategory.value !== "all") {
      result = result.filter((f) => f.category === selectedCategory.value);
    }
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(query));
    }
    if (selectedStatuses.value.length > 0) {
      const allowed = new Set(selectedStatuses.value);
      result = result.filter((f) =>
        tools.some((tool) => allowed.has(getCellData(f.id, tool.id).status.level)),
      );
    }

    return result;
  });

  const groupedFrameworks = computed(() => {
    const groups: Record<string, Framework[]> = {
      base: [],
      frontend: [],
      "meta-framework": [],
      "file-type": [],
    };
    for (const framework of filteredFrameworks.value) {
      groups[framework.category]?.push(framework);
    }
    return groups;
  });

  return {
    searchQuery,
    selectedCategory,
    selectedStatuses,
    hasActiveFilters,
    resetFilters,
    toggleStatus,
    isStatusSelected,
    filteredFrameworks,
    groupedFrameworks,
  };
}

interface Footnote {
  id: number;
  noteId?: number;
  frameworks: { name: string; tool: string }[];
  notes: string;
  sources: Source[];
  refIds: string[];
}

function useFootnotes(
  filteredFrameworks: ReturnType<typeof useFilters>["filteredFrameworks"],
  tools: Tool[],
  getCellData: (fId: string, tId: string) => CellData,
) {
  const footnoteData = computed(() => {
    const footnotes: Footnote[] = [];
    const refMap = new Map<string, { id: number; refId: string }>();
    let counter = 0;

    for (const framework of filteredFrameworks.value) {
      for (const tool of tools) {
        const { status } = getCellData(framework.id, tool.id);
        if (!status.notes) continue;

        const key = `${framework.id}-${tool.id}`;
        const refId = `ref-${framework.name.toLowerCase().replace(/[\s./]+/g, "-")}-${tool.name.toLowerCase()}`;

        const existing = footnotes.find(
          (f) =>
            (status.noteId !== undefined && f.noteId === status.noteId) || f.notes === status.notes,
        );

        if (existing) {
          if (!existing.frameworks.some((f) => f.name === framework.name && f.tool === tool.name)) {
            existing.frameworks.push({ name: framework.name, tool: tool.name });
            existing.refIds.push(refId);
            if (status.sources) {
              for (const source of status.sources) {
                if (!existing.sources.some((s) => s.url === source.url)) {
                  existing.sources.push(source);
                }
              }
            }
          }
          refMap.set(key, { id: existing.id, refId });
        } else {
          const id = ++counter;
          footnotes.push({
            id,
            noteId: status.noteId,
            frameworks: [{ name: framework.name, tool: tool.name }],
            notes: status.notes,
            sources: status.sources ? [...status.sources] : [],
            refIds: [refId],
          });
          refMap.set(key, { id, refId });
        }
      }
    }

    const footnotesByTool: Record<string, Footnote[]> = {};
    for (const footnote of footnotes) {
      const toolName = footnote.frameworks[0]?.tool ?? "Unknown";
      (footnotesByTool[toolName] ??= []).push(footnote);
    }

    return { footnotes, footnotesByTool, refMap };
  });

  function getFootnoteRef(frameworkId: string, toolId: string) {
    return footnoteData.value.refMap.get(`${frameworkId}-${toolId}`) ?? null;
  }

  function formatFrameworkNames(fws: { name: string; tool: string }[]): string {
    const names = fws.map((f) => f.name);
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
  }

  return { footnoteData, getFootnoteRef, formatFrameworkNames };
}
</script>

<template>
  <div class="mx-auto max-w-360 px-5 pb-12 md:px-8">
    <!-- Hero -->
    <div class="py-12 text-center md:py-14">
      <h1
        class="mb-3 text-3xl font-heading font-medium tracking-tighter text-primary dark:text-white md:text-5xl"
      >
        Oxlint &amp; Oxfmt Compatibility
      </h1>
      <p class="mx-auto max-w-2xl text-grey text-base md:text-lg">
        Check which JavaScript frameworks and file types are supported by Oxlint (linting) and Oxfmt
        (formatting). Hover over status indicators for details.
      </p>
    </div>

    <!-- Filters -->
    <div
      class="mb-6 flex flex-col gap-4 border border-stroke bg-white p-4 sm:p-5 dark:border-nickel dark:bg-primary"
    >
      <!-- Search -->
      <div class="flex items-center gap-2">
        <div class="relative flex-1 sm:max-w-64">
          <Icon
            icon="mdi:magnify"
            class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-grey"
            aria-hidden="true"
          />
          <label for="compat-search-frameworks" class="sr-only">Search frameworks</label>
          <input
            id="compat-search-frameworks"
            v-model="searchQuery"
            type="text"
            placeholder="Search frameworks..."
            class="w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-4 text-sm text-primary placeholder-grey outline-none transition-colors focus:border-(--vp-c-brand-1) dark:border-nickel dark:bg-slate dark:text-white"
          />
          <button
            v-if="searchQuery"
            type="button"
            aria-label="Clear search"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-grey transition-colors hover:text-primary dark:hover:text-white"
            @click="searchQuery = ''"
          >
            <Icon icon="mdi:close" width="16" aria-hidden="true" />
          </button>
        </div>
        <button
          v-if="hasActiveFilters"
          type="button"
          aria-label="Reset all filters"
          class="flex shrink-0 items-center gap-1.5 rounded-full border border-stroke bg-beige px-3 py-1.5 text-sm text-grey transition-colors hover:bg-white dark:border-nickel dark:bg-slate dark:hover:bg-nickel"
          @click="resetFilters"
        >
          <Icon icon="mdi:filter-off" width="16" aria-hidden="true" />
          Reset
        </button>
      </div>

      <!-- Category + Legend -->
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="[
              selectedCategory === category.id
                ? 'bg-primary text-white dark:bg-white dark:text-primary'
                : 'border border-stroke bg-beige text-grey hover:bg-white dark:border-nickel dark:bg-slate dark:hover:bg-nickel',
            ]"
            @click="selectedCategory = category.id"
          >
            {{ category.label }}
          </button>
        </div>

        <span class="hidden sm:block sm:flex-1" />

        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in statusConfigList"
            :key="status.level"
            type="button"
            class="flex items-center gap-2 rounded-full bg-beige px-3 py-1.5 text-sm text-grey transition-opacity dark:bg-slate"
            :class="{
              'opacity-40 hover:opacity-60': !isStatusSelected(status.level),
              'hover:opacity-80': isStatusSelected(status.level),
            }"
            :aria-pressed="isStatusSelected(status.level)"
            @click="toggleStatus(status.level)"
          >
            <span
              class="flex size-5 items-center justify-center rounded-md"
              :class="status.colorClass"
            >
              <Icon :icon="status.icon" width="14" :class="status.textClass" />
            </span>
            <span>{{ status.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="border border-stroke dark:border-nickel">
      <table class="w-full table-fixed border-separate border-spacing-0">
        <thead>
          <tr>
            <th
              class="sticky left-0 top-12 z-30 w-40 border-b-2 border-stroke bg-white px-4 py-3 text-left text-sm font-semibold text-grey sm:w-[220px] lg:top-[calc(var(--vp-banner-height,0px)+var(--vp-nav-height)-1px)] dark:border-nickel dark:bg-primary"
            >
              Framework / File Type
            </th>
            <th
              v-for="tool in tools"
              :key="tool.id"
              class="sticky top-12 z-20 border-b-2 border-stroke bg-white px-4 py-3 text-center text-sm font-bold text-primary lg:top-[calc(var(--vp-banner-height,0px)+var(--vp-nav-height)-1px)] dark:border-nickel dark:bg-primary dark:text-white"
            >
              {{ tool.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(categoryFrameworks, category) in groupedFrameworks" :key="category">
            <tr v-if="categoryFrameworks.length > 0">
              <td
                :colspan="1 + tools.length"
                class="bg-beige px-4 py-2 text-xs font-semibold uppercase tracking-wider text-grey dark:bg-midnight"
              >
                {{ categoryLabels[category as FrameworkCategory] }}
              </td>
            </tr>
            <tr
              v-for="framework in categoryFrameworks"
              :key="framework.id"
              class="group border-b border-stroke transition-colors hover:bg-beige dark:border-nickel dark:hover:bg-slate/50"
            >
              <th
                scope="row"
                class="sticky left-0 z-10 w-40 bg-white px-4 py-3 text-left transition-colors sm:w-[220px] group-hover:bg-beige dark:bg-primary dark:group-hover:bg-slate/50"
              >
                <span class="flex items-center gap-3 text-primary dark:text-white">
                  <Icon :icon="framework.icon" width="22" class="shrink-0" aria-hidden="true" />
                  <span class="font-medium">{{ framework.name }}</span>
                </span>
              </th>
              <td v-for="tool in tools" :key="tool.id" class="px-4 py-3 text-center">
                <div class="relative inline-flex items-center justify-center">
                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-lg transition-transform hover:scale-110"
                    :class="getCellData(framework.id, tool.id).config.colorClass"
                    :aria-label="`${framework.name} ${tool.name}: ${getCellData(framework.id, tool.id).config.label}${getCellData(framework.id, tool.id).status.notes ? ` — ${getCellData(framework.id, tool.id).status.notes}` : ''}`"
                    @mouseenter="activeTooltip = `${framework.id}-${tool.id}`"
                    @mouseleave="activeTooltip = null"
                    @focus="activeTooltip = `${framework.id}-${tool.id}`"
                    @blur="activeTooltip = null"
                  >
                    <Icon
                      :icon="getCellData(framework.id, tool.id).config.icon"
                      width="20"
                      :class="getCellData(framework.id, tool.id).config.textClass"
                      aria-hidden="true"
                    />
                  </button>
                  <a
                    v-if="getFootnoteRef(framework.id, tool.id)"
                    :id="getFootnoteRef(framework.id, tool.id)!.refId"
                    :href="`#footnote-${getFootnoteRef(framework.id, tool.id)!.id}`"
                    class="absolute -top-1 left-full ml-0.5 text-[10px] text-grey hover:text-(--vp-c-brand-1)"
                    :aria-label="`See footnote ${getFootnoteRef(framework.id, tool.id)!.id}`"
                  >
                    {{ getFootnoteRef(framework.id, tool.id)!.id }}
                  </a>
                  <!-- Tooltip -->
                  <div
                    v-if="
                      activeTooltip === `${framework.id}-${tool.id}` &&
                      getCellData(framework.id, tool.id).status.notes
                    "
                    class="absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-primary px-3 py-2 text-center text-xs text-white shadow-lg pointer-events-none dark:border dark:border-nickel dark:bg-slate"
                    role="tooltip"
                  >
                    {{ getCellData(framework.id, tool.id).status.notes }}
                    <div
                      class="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-primary dark:bg-slate"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="filteredFrameworks.length === 0">
            <td :colspan="1 + tools.length" class="px-4 py-8 text-center text-grey">
              No frameworks found matching your filters.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footnotes -->
    <div
      v-if="footnoteData.footnotes.length > 0"
      class="mt-6 border border-stroke p-5 dark:border-nickel"
    >
      <div
        v-for="(toolFootnotes, toolName) in footnoteData.footnotesByTool"
        :key="toolName"
        class="mb-4 last:mb-0"
      >
        <h3 class="mb-2 text-sm font-semibold text-primary dark:text-white">{{ toolName }}</h3>
        <ol class="flex flex-col gap-2">
          <li
            v-for="footnote in toolFootnotes"
            :id="`footnote-${footnote.id}`"
            :key="footnote.id"
            class="flex gap-2 text-sm text-grey"
          >
            <span class="flex shrink-0 items-center gap-1">
              <a
                :href="`#${footnote.refIds[0]}`"
                class="text-grey hover:text-(--vp-c-brand-1)"
                :aria-label="`Back to reference ${footnote.id}`"
                >&#8593;</a
              >
              <span class="font-medium text-grey">{{ footnote.id }}.</span>
            </span>
            <div>
              <span class="font-medium text-primary dark:text-white/80">
                {{ formatFrameworkNames(footnote.frameworks) }}:
              </span>
              {{ footnote.notes }}
              <span v-if="footnote.sources.length > 0" class="ml-1">
                [<template v-for="(source, idx) in footnote.sources" :key="source.url">
                  <a
                    :href="source.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-(--vp-c-brand-1) underline hover:opacity-80"
                    >{{ source.title }}</a
                  >
                  <span v-if="idx < footnote.sources.length - 1">, </span> </template
                >]
              </span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
