import type { CompatEntry, Tool } from "./types";

export const oxlintTool: Tool = {
  id: "oxlint",
  name: "Oxlint",
  description: "Lightning fast JavaScript linter",
  features: [
    {
      id: "lint",
      name: "Linting",
      description: "Code linting support",
    },
  ],
};

const oxlintPlugins = {
  title: "Built-in Plugins",
  url: "https://oxc.rs/docs/guide/usage/linter/plugins.html",
};
const sfcIssue = {
  title: "SFC Template Support",
  url: "https://github.com/oxc-project/oxc/issues/15761",
};

export const NOTE_ID_NO_TEMPLATE_LINT = 1;
export const NOTE_ID_COMPILER_RULES = 2;
export const NOTE_ID_SOLID_RULES = 4;

const noTemplateLintNote = {
  noteId: NOTE_ID_NO_TEMPLATE_LINT,
  notes: "No template linting yet",
  sources: [oxlintPlugins, sfcIssue],
};
const compilerRulesNote = {
  noteId: NOTE_ID_COMPILER_RULES,
  notes: "React Compiler-related rules available via JS plugins",
  sources: [oxlintPlugins],
};
const solidRulesNote = {
  noteId: NOTE_ID_SOLID_RULES,
  notes: "Solid-specific rules available via JS plugins",
  sources: [oxlintPlugins],
};

export const oxlintEntries: CompatEntry[] = [
  {
    frameworkId: "javascript",
    toolId: "oxlint",
    featureId: "lint",
    status: {
      level: "full",
      notes: "Full ESLint plugin compatibility",
      sources: [oxlintPlugins],
    },
  },
  {
    frameworkId: "typescript",
    toolId: "oxlint",
    featureId: "lint",
    status: {
      level: "full",
      notes: "Can run type-aware rules (based on typescript-eslint) and do type-checking via ts-go",
      sources: [
        {
          title: "Type-Aware Linting",
          url: "https://oxc.rs/docs/guide/usage/linter/type-aware.html",
        },
      ],
    },
  },
  {
    frameworkId: "react",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "full", ...compilerRulesNote },
  },
  {
    frameworkId: "vue",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "partial", ...noTemplateLintNote },
  },
  {
    frameworkId: "svelte",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "partial", ...noTemplateLintNote },
  },
  {
    frameworkId: "angular",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "partial", ...noTemplateLintNote },
  },
  {
    frameworkId: "solid",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "full", ...solidRulesNote },
  },
  {
    frameworkId: "qwik",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "full" },
  },
  {
    frameworkId: "preact",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "full" },
  },
  {
    frameworkId: "lit",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "full" },
  },
  {
    frameworkId: "ember",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "partial", ...noTemplateLintNote },
  },
  {
    frameworkId: "alpine",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "full" },
  },
  {
    frameworkId: "react-native",
    toolId: "oxlint",
    featureId: "lint",
    status: {
      level: "full",
      notes: "Expo-specific rules available via JS plugins",
      sources: [oxlintPlugins],
    },
  },
  {
    frameworkId: "nextjs",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "full", ...compilerRulesNote },
  },
  {
    frameworkId: "nuxt",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "partial", ...noTemplateLintNote },
  },
  {
    frameworkId: "astro",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "partial", ...noTemplateLintNote },
  },
  {
    frameworkId: "remix",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "full" },
  },
  {
    frameworkId: "sveltekit",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "partial", ...noTemplateLintNote },
  },
  {
    frameworkId: "tanstack-start",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "full" },
  },
  {
    frameworkId: "analogjs",
    toolId: "oxlint",
    featureId: "lint",
    status: { level: "partial", ...noTemplateLintNote },
  },
  { frameworkId: "css", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "scss", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "html", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "json", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "yaml", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "markdown", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "graphql", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "toml", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "less", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "xml", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "prisma", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "sql", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "shell", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
  { frameworkId: "nginx", toolId: "oxlint", featureId: "lint", status: { level: "n/a" } },
];
