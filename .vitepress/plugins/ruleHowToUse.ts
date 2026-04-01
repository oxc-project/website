import type MarkdownIt from "markdown-it";

const BUILTIN_PLUGINS = ["eslint", "oxc", "typescript", "unicorn"];

function parseFrontmatter(src: string): Record<string, string> {
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    result[key] = value;
  }
  return result;
}

function generateCodeGroup(frontmatter: Record<string, unknown>): string {
  const title = frontmatter.title as string;
  const typeAware = frontmatter.type_aware === "true";

  const slashIdx = title.indexOf("/");
  const plugin = slashIdx !== -1 ? title.slice(0, slashIdx) : "eslint";
  const isBuiltin = BUILTIN_PLUGINS.includes(plugin);

  const configRuleName = plugin === "eslint" && slashIdx !== -1 ? title.slice(slashIdx + 1) : title;

  // Build JSON config
  const jsonLines: string[] = ["{"];
  if (typeAware) {
    jsonLines.push('  "options": {');
    jsonLines.push('    "typeAware": true');
    jsonLines.push("  },");
  }
  if (!isBuiltin) {
    jsonLines.push(`  "plugins": ["${plugin}"],`);
  }
  jsonLines.push('  "rules": {');
  jsonLines.push(`    "${configRuleName}": "error"`);
  jsonLines.push("  }");
  jsonLines.push("}");

  const tsLines: string[] = [
    'import { defineConfig } from "oxlint";',
    "",
    "export default defineConfig({",
    ...(typeAware ? ["  options: { typeAware: true },"] : []),
    ...(isBuiltin ? [] : [`  plugins: ["${plugin}"],`]),
    "  rules: {",
    `    "${configRuleName}": "error",`,
    "  },",
    "});",
  ];

  // Build CLI command
  let cli = "oxlint";
  if (typeAware) cli += " --type-aware";
  cli += ` --deny ${configRuleName}`;
  if (!isBuiltin) cli += ` --${plugin}-plugin`;

  return [
    "To **enable** this rule using the config file or in the CLI, you can use:",
    "",
    "::: code-group",
    "",
    "```json [Config (.oxlintrc.json)]",
    ...jsonLines,
    "```",
    "```ts [Config (oxlint.config.ts)]",
    ...tsLines,
    "```",
    "",
    "```bash [CLI]",
    cli,
    "```",
    "",
    ":::",
  ].join("\n");
}

export function ruleHowToUseMdPlugin(md: MarkdownIt): void {
  const parse = md.parse.bind(md);
  md.parse = (src: string, env: Record<string, unknown>) => {
    if (src.includes("<RuleHowToUse />")) {
      const data = parseFrontmatter(src);
      src = src.replace("<RuleHowToUse />", generateCodeGroup(data));
    }
    return parse(src, env);
  };
}
