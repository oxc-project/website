import BLOG_SIDEBAR from "../sidebar.blog.json" with { type: "json" };
import { defineLocaleConfig } from "./utils";

const TITLE = "The JavaScript Oxidation Compiler";
const DESCRIPTION = "A collection of high-performance JavaScript tools written in Rust";

export const enConfig = defineLocaleConfig("root", {
  label: "English",
  lang: "en",
  title: TITLE,
  titleTemplate: `:title | ${TITLE}`,
  description: DESCRIPTION,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/docs/guide/introduction" },
      {
        text: "Tools",
        items: [
          { text: "Linter (Oxlint)", link: "/docs/guide/usage/linter" },
          { text: "Formatter (Oxfmt)", link: "/docs/guide/usage/formatter" },
          { text: "Parser", link: "/docs/guide/usage/parser" },
          { text: "Transformer", link: "/docs/guide/usage/transformer" },
          { text: "Minifier", link: "/docs/guide/usage/minifier" },
          { text: "Resolver", link: "/docs/guide/usage/resolver" },
        ],
      },
      { text: "Contribute", link: "/docs/contribute/introduction" },
      {
        text: "Playground",
        target: "_blank",
        link: "https://playground.oxc.rs",
      },
      { text: "Sponsor", link: "/sponsor" },
      {
        text: "Resources",
        items: [
          { text: "Release Blog", link: BLOG_SIDEBAR[0].link },
          { text: "Endorsements", link: "/endorsements" },
          { text: "Learn", link: "/docs/learn/parser_in_rust/intro" },
          { text: "Team", link: "/team" },
          { text: "Releases", link: "https://github.com/oxc-project/oxc/releases" },
          { text: "Website GitHub", link: "https://github.com/oxc-project/website" },
        ],
      },
    ],
    sidebar: {
      "/docs/guide/": [
        {
          text: "Introduction",
          collapsed: false,
          items: [
            { text: "What is Oxc?", link: "/docs/guide/what-is-oxc" },
            { text: "Getting Started", link: "/docs/guide/introduction" },
          ],
        },
        {
          text: "Oxlint",
          collapsed: true,
          link: "/docs/guide/usage/linter",
          items: [
            { text: "Overview", link: "/docs/guide/usage/linter" },
            {
              text: "Configure and integrate",
              items: [
                { text: "Quickstart", link: "/docs/guide/usage/linter/quickstart" },
                { text: "Configuration", link: "/docs/guide/usage/linter/config" },
                { text: "Editor setup", link: "/docs/guide/usage/linter/editors" },
                { text: "CI & other setup", link: "/docs/guide/usage/linter/ci" },
                {
                  text: "Nested configs",
                  link: "/docs/guide/usage/linter/nested-config",
                },
              ],
            },
            {
              text: "Features",
              items: [
                { text: "Built-in plugins", link: "/docs/guide/usage/linter/plugins" },
                { text: "Automatic fixes", link: "/docs/guide/usage/linter/automatic-fixes" },
                { text: "Ignore files", link: "/docs/guide/usage/linter/ignore-files" },
                {
                  text: "Inline ignore comments",
                  link: "/docs/guide/usage/linter/ignore-comments",
                },
                {
                  text: "Multi-file analysis",
                  link: "/docs/guide/usage/linter/multi-file-analysis",
                },
                {
                  text: "Output formats",
                  link: "/docs/guide/usage/linter/output-formats",
                },
                { text: "Type-aware linting", link: "/docs/guide/usage/linter/type-aware" },
                { text: "JS plugins", link: "/docs/guide/usage/linter/js-plugins" },
              ],
            },
            {
              text: "Migration",
              items: [
                { text: "From ESLint", link: "/docs/guide/usage/linter/migrate-from-eslint" },
                // { text: "From Biome", link: "/docs/guide/usage/linter/migrate-from-biome" },
              ],
            },
            {
              text: "Reference",
              items: [
                { text: "Rules reference", link: "/docs/guide/usage/linter/rules" },
                { text: "CLI reference", link: "/docs/guide/usage/linter/cli" },
                {
                  text: "Config file reference",
                  link: "/docs/guide/usage/linter/config-file-reference",
                },
                { text: "Versioning", link: "/docs/guide/usage/linter/versioning" },
              ],
            },
          ],
        },
        {
          text: "Oxfmt",
          collapsed: true,
          link: "/docs/guide/usage/formatter",
          items: [
            {
              text: "Overview",
              link: "/docs/guide/usage/formatter",
            },
            {
              text: "Configure and integrate",
              items: [
                {
                  text: "Quickstart",
                  link: "/docs/guide/usage/formatter/quickstart",
                },
                {
                  text: "Configuration",
                  link: "/docs/guide/usage/formatter/config",
                },
                { text: "Editor setup", link: "/docs/guide/usage/formatter/editors" },
                { text: "CI & other setup", link: "/docs/guide/usage/formatter/ci" },
              ],
            },
            {
              text: "Features",
              items: [
                {
                  text: "Ignore files",
                  link: "/docs/guide/usage/formatter/ignore-files",
                },
                {
                  text: "Inline ignore comments",
                  link: "/docs/guide/usage/formatter/ignore-comments",
                },
                {
                  text: "Sorting",
                  link: "/docs/guide/usage/formatter/sorting",
                },
                {
                  text: "Embedded formatting",
                  link: "/docs/guide/usage/formatter/embedded-formatting",
                },
              ],
            },
            {
              text: "Migration",
              items: [
                {
                  text: "Migrate from Prettier",
                  link: "/docs/guide/usage/formatter/migrate-from-prettier",
                },
              ],
            },
            {
              text: "Reference",
              items: [
                {
                  text: "CLI reference",
                  link: "/docs/guide/usage/formatter/cli",
                },
                {
                  text: "Configuration file reference",
                  link: "/docs/guide/usage/formatter/config-file-reference",
                },
                {
                  text: "Unsupported features",
                  link: "/docs/guide/usage/formatter/unsupported-features",
                },
              ],
            },
          ],
        },
        {
          text: "Parser",
          collapsed: true,
          link: "/docs/guide/usage/parser",
          items: [{ text: "Overview", link: "/docs/guide/usage/parser" }],
        },
        {
          text: "Transformer",
          collapsed: true,
          link: "/docs/guide/usage/transformer",
          items: [
            { text: "Overview", link: "/docs/guide/usage/transformer" },
            {
              text: "Lowering",
              link: "/docs/guide/usage/transformer/lowering",
            },
            {
              text: "TypeScript",
              link: "/docs/guide/usage/transformer/typescript",
            },
            {
              text: "JSX",
              link: "/docs/guide/usage/transformer/jsx",
            },
            {
              text: "Plugins",
              link: "/docs/guide/usage/transformer/plugins",
            },
            {
              text: "Global Variable Replacement",
              link: "/docs/guide/usage/transformer/global-variable-replacement",
            },
            {
              text: "Isolated Declarations",
              link: "/docs/guide/usage/transformer/isolated-declarations",
            },
          ],
        },
        {
          text: "Minifier",
          collapsed: true,
          link: "/docs/guide/usage/minifier",
          items: [
            {
              text: "Overview",
              link: "/docs/guide/usage/minifier",
            },
            {
              text: "Dead Code Elimination",
              link: "/docs/guide/usage/minifier/dead-code-elimination",
            },
            {
              text: "Syntax Normalization",
              link: "/docs/guide/usage/minifier/syntax-normalization",
            },
            {
              text: "Mangling",
              link: "/docs/guide/usage/minifier/mangling",
            },
            {
              text: "Whitespace Stripping",
              link: "/docs/guide/usage/minifier/whitespace-stripping",
            },
            {
              text: "FAQ",
              link: "/docs/guide/usage/minifier/faq",
            },
          ],
        },
        {
          text: "Resolver",
          collapsed: true,
          link: "/docs/guide/usage/resolver",
          items: [{ text: "Overview", link: "/docs/guide/usage/resolver" }],
        },
        {
          text: "Resources",
          collapsed: false,
          items: [
            { text: "Troubleshooting", link: "/docs/guide/troubleshooting" },
            { text: "Benchmarks", link: "/docs/guide/benchmarks" },
            { text: "Projects using Oxc", link: "/docs/guide/projects" },
            { text: "Talks & media", link: "/docs/guide/media" },
          ],
        },
      ],
      "/docs/learn/": [
        {
          text: "JavaScript Parser in Rust",
          items: [
            { text: "Introduction", link: "/docs/learn/parser_in_rust/intro" },
            { text: "Lexer", link: "/docs/learn/parser_in_rust/lexer" },
            { text: "AST", link: "/docs/learn/parser_in_rust/ast" },
            { text: "Parser", link: "/docs/learn/parser_in_rust/parser" },
            { text: "Errors", link: "/docs/learn/parser_in_rust/errors" },
            { text: "Semantic Analysis", link: "/docs/learn/parser_in_rust/semantic_analysis" },
          ],
        },
        {
          text: "Architecture",
          items: [
            {
              text: "Parser",
              link: "/docs/learn/architecture/parser",
            },
            {
              text: "Linter",
              link: "/docs/learn/architecture/linter",
            },
            {
              text: "Test Infrastructure",
              link: "/docs/learn/architecture/test",
            },
            {
              text: "AST Tools",
              link: "/docs/learn/architecture/ast-tools",
            },
          ],
        },
        {
          text: "ECMAScript",
          items: [
            { text: "Specification", link: "/docs/learn/ecmascript/spec" },
            {
              text: "Grammar",
              link: "/docs/learn/ecmascript/grammar",
            },
          ],
        },
        { text: "Performance", link: "/docs/learn/performance" },
        { text: "Terminology", link: "/docs/learn/terminology" },
        { text: "References", link: "/docs/learn/references" },
      ],
      "/docs/contribute/": [
        {
          text: "Contribute",
          items: [
            { text: "Introduction", link: "/docs/contribute/introduction" },
            { text: "Getting Started", link: "/docs/contribute/development" },
          ],
        },
        {
          text: "Tools",
          items: [
            {
              text: "Parser",
              link: "/docs/contribute/parser",
              items: [
                {
                  text: "AST",
                  link: "/docs/contribute/parser/ast",
                },
              ],
            },
            {
              text: "Linter",
              link: "/docs/contribute/linter",
              items: [{ text: "Adding Rules", link: "/docs/contribute/linter/adding-rules" }],
            },
            { text: "Formatter", link: "/docs/contribute/formatter" },
            { text: "Resolver", link: "/docs/contribute/resolver" },
            {
              text: "Transformer",
              link: "/docs/contribute/transformer",
            },
            { text: "Minifier", link: "/docs/contribute/minifier" },
            { text: "Language Server", link: "/docs/contribute/language_server" },
            { text: "VSCode", link: "/docs/contribute/vscode" },
          ],
        },
        { text: "Debugging", link: "/docs/contribute/debugging" },
        { text: "Profiling", link: "/docs/contribute/profiling" },
        { text: "Rules and Policy", link: "/docs/contribute/rules" },
        { text: "Security Policy", link: "/docs/contribute/security" },
      ],
      "/blog/": BLOG_SIDEBAR,
    },
    outline: {
      level: [2, 3],
    },
    editLink: {
      pattern: "https://github.com/oxc-project/oxc-project.github.io/edit/main/src/:path",
      text: "Suggest changes to this page",
    },
  },
});
