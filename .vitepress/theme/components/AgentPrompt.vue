<script setup lang="ts">
import { onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    prompt: string;
    title?: string;
  }>(),
  { title: "Try it in your codebase" },
);

const copied = ref(false);
const error = ref("");
let resetTimer: ReturnType<typeof setTimeout> | undefined;

async function copyPrompt() {
  clearTimeout(resetTimer);
  error.value = "";
  copied.value = false;

  try {
    await navigator.clipboard.writeText(props.prompt);
    copied.value = true;
    resetTimer = setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch {
    error.value = "Couldn’t copy. Select and copy the prompt below.";
  }
}

onUnmounted(() => clearTimeout(resetTimer));
</script>

<template>
  <aside class="agent-prompt" :aria-label="title">
    <div class="agent-prompt__header">
      <h3 class="agent-prompt__title">{{ title }}</h3>
      <button class="agent-prompt__copy" type="button" @click="copyPrompt">
        {{ copied ? "Copied!" : "Copy agent task" }}
      </button>
    </div>
    <div class="agent-prompt__description"><slot /></div>
    <pre class="agent-prompt__text"><code>{{ prompt }}</code></pre>
    <p class="agent-prompt__status" :class="{ 'agent-prompt__status--error': error }" role="status">
      {{ error || (copied ? "Prompt copied to clipboard." : "") }}
    </p>
  </aside>
</template>

<style scoped>
.agent-prompt {
  margin: 32px 0;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.agent-prompt__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.agent-prompt .agent-prompt__title {
  margin: 0;
  font-size: 20px;
  line-height: 1.4;
  color: var(--vp-c-text-1);
}

.agent-prompt__copy {
  flex-shrink: 0;
  min-width: 140px;
  min-height: 44px;
  padding: 8px 14px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.agent-prompt__copy:hover {
  opacity: 0.85;
}

.agent-prompt__copy:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.agent-prompt__description {
  margin: 16px 0 20px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.agent-prompt__description :deep(p) {
  margin: 0;
}

.agent-prompt .agent-prompt__status {
  margin: 0;
  font-size: 14px;
}

.agent-prompt__status:not(.agent-prompt__status--error) {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.agent-prompt .agent-prompt__text {
  margin: 0;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.agent-prompt .agent-prompt__text code {
  padding: 0;
  background: none;
  color: inherit;
  font-size: 14px;
  line-height: 1.8;
}

@media (max-width: 480px) {
  .agent-prompt {
    padding: 20px 16px;
  }
}
</style>
