<script setup lang="ts">
import { useData } from "vitepress";
import Alert from "./Alert.vue";
import { computed } from "vue";
import fixEmoji from "./utils/fixEmoji";

const { frontmatter } = useData();
const rule = frontmatter.value.rule;
const category = frontmatter.value.category;
const fix = frontmatter.value.fix;
const typeAware = frontmatter.value.type_aware;

const hasFixMessage = computed(() => {
  return fix !== "none";
});

const defaultMessage = typeAware
  ? "This rule is turned on by default when type-aware linting is enabled."
  : "This rule is turned on by default.";

const emoji = computed(() => fixEmoji(fix));

const fixMessage = computed(() => {
  const f = fix ?? "none";

  if (f === "none") {
    return "No auto-fix is available for this rule.";
  }
  if (f === "pending") {
    return "An auto-fix is planned for this rule, but not implemented at this time.";
  }

  // Parse tokens after the prefix (e.g., "fixable_dangerous_fix_or_suggestion")
  const tokens = f.split("_");
  const prefix = tokens[0];
  const rest = tokens.slice(1);
  const isConditional = prefix === "conditional";
  const hasFix = rest.includes("fix");
  const hasSuggestion = rest.includes("suggestion");
  const isDangerous = rest.includes("dangerous");

  // Determine the noun per Rust logic
  let noun = "auto-fix is available for this rule";
  if (hasFix && hasSuggestion) {
    noun = "auto-fix and a suggestion are available for this rule";
  } else if (hasFix) {
    noun = "auto-fix is available for this rule";
  } else if (hasSuggestion) {
    noun = "suggestion is available for this rule";
  }

  let message = isDangerous ? `dangerous ${noun}` : noun;

  // Article selection
  const first = message.trim().charAt(0).toLowerCase();
  const article = ["a", "e", "i", "o", "u"].includes(first) ? "An" : "A";

  if (isConditional) {
    message += " for some violations";
  }

  return `${article} ${message}.`;
});
</script>

<template>
  <div>
    <header>
      <a class="back-to-rules" href="/docs/guide/usage/linter/rules" aria-label="Back to rules"
        >← Back to rules</a
      >
      <h1>{{ rule }} <Badge type="info" :text="category" /></h1>
    </header>

    <div class="rule-meta">
      <Alert v-if="frontmatter.default" class="default-on" type="success">
        <span class="emoji">✅</span> {{ defaultMessage }}
      </Alert>

      <Alert v-if="frontmatter.type_aware" type="info">
        <span class="emoji">💭</span> This rule requires
        <a href="/docs/guide/usage/linter/type-aware" target="_blank" rel="noreferrer"
          >type information</a
        >.
      </Alert>

      <Alert v-if="hasFixMessage" class="fix" type="info">
        <span class="emoji">{{ emoji }}</span> {{ fixMessage }}
      </Alert>
    </div>
  </div>
</template>

<style scoped>
.back-to-rules {
  display: inline-block;
  margin-bottom: 0.25rem;
  color: var(--vp-c-link);
  text-decoration: none;
  font-size: 0.95rem;
}

.back-to-rules:hover {
  text-decoration: underline;
}

header .back-to-rules {
  margin-bottom: 0.5rem;
}

header h1 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
