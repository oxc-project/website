import type { CompatEntry, Tool } from "./types";

export const oxfmtTool: Tool = {
  id: "oxfmt",
  name: "Oxfmt",
  description: "Lightning fast code formatter",
  features: [
    {
      id: "format",
      name: "Format",
      description: "Code formatting support",
    },
  ],
};

const gjsGtsIssue = {
  title: ".gjs/.gts File Support",
  url: "https://github.com/oxc-project/oxc/issues/19964",
};
const associationsDoc = {
  title: "associations",
  url: "/docs/guide/usage/formatter/config#associations",
};

export const NOTE_ID_NEEDS_ASTRO_COMPILER = 3;
export const NOTE_ID_NO_GJS_GTS = 6;
export const NOTE_ID_ANGULAR_HTML = 7;
export const NOTE_ID_NEEDS_SVELTE_COMPILER = 8;

const needsAstroCompiler = {
  noteId: NOTE_ID_NEEDS_ASTRO_COMPILER,
  notes: "Requires installing `@astrojs/compiler-rs` separately",
};
const needsSvelteCompiler = {
  noteId: NOTE_ID_NEEDS_SVELTE_COMPILER,
  notes: "Requires installing `svelte/compiler` separately",
};
const noGjsGtsNote = {
  noteId: NOTE_ID_NO_GJS_GTS,
  notes: ".hbs only, no .gjs/.gts template tag support",
  sources: [gjsGtsIssue],
};
const angularHtmlNote = {
  noteId: NOTE_ID_ANGULAR_HTML,
  notes: "Other than .component.html, requires `associations` config",
  sources: [associationsDoc],
};

export const oxfmtEntries: CompatEntry[] = [
  { frameworkId: "javascript", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "typescript", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "react", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "vue", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  {
    frameworkId: "svelte",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "full", ...needsSvelteCompiler },
  },
  {
    frameworkId: "angular",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "full", ...angularHtmlNote },
  },
  { frameworkId: "solid", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "qwik", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "preact", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "lit", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  {
    frameworkId: "ember",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "partial", ...noGjsGtsNote },
  },
  { frameworkId: "alpine", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  {
    frameworkId: "react-native",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "full" },
  },
  { frameworkId: "nextjs", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "nuxt", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  {
    frameworkId: "astro",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "full", ...needsAstroCompiler },
  },
  { frameworkId: "remix", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  {
    frameworkId: "sveltekit",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "full", ...needsSvelteCompiler },
  },
  {
    frameworkId: "solidstart",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "full" },
  },
  {
    frameworkId: "tanstack-start",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "full" },
  },
  {
    frameworkId: "react-router",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "full" },
  },
  {
    frameworkId: "analogjs",
    toolId: "oxfmt",
    featureId: "format",
    status: { level: "full", ...angularHtmlNote },
  },
  { frameworkId: "css", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "scss", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "html", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "json", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "yaml", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "markdown", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "graphql", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "toml", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  { frameworkId: "less", toolId: "oxfmt", featureId: "format", status: { level: "full" } },
  {
    frameworkId: "xml",
    toolId: "oxfmt",
    featureId: "format",
    status: {
      level: "none",
      notes: "Planned for Oxfmt 1.0",
      sources: [
        { title: "SVG/XML Support", url: "https://github.com/oxc-project/oxc/issues/18035" },
      ],
    },
  },
  { frameworkId: "prisma", toolId: "oxfmt", featureId: "format", status: { level: "none" } },
  { frameworkId: "sql", toolId: "oxfmt", featureId: "format", status: { level: "none" } },
  { frameworkId: "shell", toolId: "oxfmt", featureId: "format", status: { level: "none" } },
  { frameworkId: "nginx", toolId: "oxfmt", featureId: "format", status: { level: "none" } },
];
