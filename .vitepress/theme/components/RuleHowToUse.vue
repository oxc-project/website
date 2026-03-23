<script setup lang="ts">
import { useData } from "vitepress";
import { computed, useId } from "vue";

const { frontmatter } = useData();

const BUILTIN_PLUGINS = ["eslint", "oxc", "typescript", "unicorn"];

const title = computed(() => frontmatter.value.title as string);
const typeAware = computed(() => frontmatter.value.type_aware as boolean);

const plugin = computed(() => {
  const idx = title.value.indexOf("/");
  return idx !== -1 ? title.value.slice(0, idx) : "eslint";
});

const isBuiltin = computed(() => BUILTIN_PLUGINS.includes(plugin.value));

const configRuleName = computed(() => {
  if (plugin.value === "eslint") {
    const idx = title.value.indexOf("/");
    return idx !== -1 ? title.value.slice(idx + 1) : title.value;
  }
  return title.value;
});

const jsonConfig = computed(() => {
  const lines: string[] = ["{"];

  if (typeAware.value) {
    lines.push('  "options": {');
    lines.push('    "typeAware": true');
    lines.push("  },");
  }

  if (!isBuiltin.value) {
    lines.push(`  "plugins": ["${plugin.value}"],`);
  }

  lines.push('  "rules": {');
  lines.push(`    "${configRuleName.value}": "error"`);
  lines.push("  }");
  lines.push("}");
  return lines.join("\n");
});

const cliCommand = computed(() => {
  let cmd = "oxlint";
  if (typeAware.value) {
    cmd += " --type-aware";
  }
  cmd += ` --deny ${configRuleName.value}`;
  if (!isBuiltin.value) {
    cmd += ` --${plugin.value}-plugin`;
  }
  return cmd;
});

const groupId = useId();
</script>

<template>
  <div class="vp-code-group">
    <div class="tabs">
      <input type="radio" :name="`group-${groupId}`" :id="`tab-${groupId}-0`" checked />
      <label :for="`tab-${groupId}-0`">Config (.oxlintrc.json)</label>
      <input type="radio" :name="`group-${groupId}`" :id="`tab-${groupId}-1`" />
      <label :for="`tab-${groupId}-1`">CLI</label>
    </div>
    <div class="blocks">
      <div class="language-json active">
        <span class="lang">json</span>
        <pre><code>{{ jsonConfig }}</code></pre>
      </div>
      <div class="language-bash">
        <span class="lang">bash</span>
        <pre><code>{{ cliCommand }}</code></pre>
      </div>
    </div>
  </div>
</template>
