<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import { data } from "../../../src/docs/guide/usage/linter/rules/version.data.js";

const { frontmatter } = useData();

const rule = computed(() => frontmatter.value.rule as string);
const hasTsgolint = computed(() => frontmatter.value.type_aware === true);
const upstream = computed(() => frontmatter.value.upstream as string | undefined);

function toSnakeCase(str: string): string {
  return str.replace(/-/g, "_");
}

const source = computed(() => {
  const snaked = toSnakeCase(rule.value);
  const slashIdx = snaked.indexOf("/");
  const plugin = slashIdx !== -1 ? snaked.slice(0, slashIdx) : "eslint";
  const ruleName = slashIdx !== -1 ? snaked.slice(slashIdx + 1) : snaked;
  return `https://github.com/oxc-project/oxc/blob/${data}/crates/oxc_linter/src/rules/${plugin}/${ruleName}.rs`;
});

const tsgolintSource = computed(() => {
  if (!hasTsgolint.value) {
    return "";
  }
  const slashIdx = rule.value.indexOf("/");
  const ruleName = slashIdx !== -1 ? rule.value.slice(slashIdx + 1) : rule.value;
  const snaked = toSnakeCase(ruleName);
  return `https://github.com/oxc-project/tsgolint/blob/main/internal/rules/${snaked}/${snaked}.go`;
});

const playgroundUrl = computed(() => {
  if (hasTsgolint.value) {
    return "";
  }
  return `https://playground.oxc.rs/?lintRules=${encodeURIComponent(rule.value)}`;
});
</script>

<template>
  <ul>
    <li>
      <a :href="source" target="_blank" rel="noreferrer">Rule Source</a>
    </li>
    <li v-if="upstream">
      <a :href="upstream" target="_blank" rel="noreferrer">Upstream rule docs</a>
    </li>
    <li v-if="hasTsgolint">
      <a :href="tsgolintSource" target="_blank" rel="noreferrer">Rule Source (tsgolint)</a>
    </li>
    <li v-if="!hasTsgolint">
      <a :href="playgroundUrl" target="_blank" rel="noreferrer">Open rule in Oxc Playground</a>
    </li>
  </ul>
</template>
