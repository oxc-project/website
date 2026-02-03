import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, HeadConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import llmstxt from "vitepress-plugin-llms";
import BLOG_SIDEBAR from "../sidebar.blog.json" with { type: "json" };

const latestBlog = BLOG_SIDEBAR[0];
const bannerScript = `(() => {
  const saved = localStorage.getItem("oxc-banner-dismissed-${latestBlog.link}");
  if (saved === "true") {
    document.documentElement.classList.add("banner-dismissed");
  }
})();`;

const head: HeadConfig[] = [
  [
    "link",
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/logo-without-border.svg",
    },
  ],
  // Open Graph
  ["meta", { property: "og:site_name", content: "Oxc" }],
  [
    "meta",
    {
      property: "og:image",
      content: "https://oxc.rs/og.jpg",
    },
  ],
  // Twitter (X)
  ["meta", { name: "twitter:site", content: "Oxc" }],
  ["meta", { name: "twitter:card", content: "summary_large_image" }],
  [
    "meta",
    {
      name: "twitter:image",
      content: "https://oxc.rs/og.jpg",
    },
  ],
  // banner
  ["script", {}, bannerScript],
  // Fathom Analytics
  [
    "script",
    {
      src: "https://cdn.usefathom.com/script.js",
      "data-site": "XPSGWNDW",
      "data-spa": "auto",
      defer: "",
    },
  ],
];

if (process.env.NODE_ENV === "production" && process.env.REDIRECT) {
  head.unshift(["meta", { "http-equiv": "refresh", content: "0; URL=https://oxc.rs" }]);
}

export const sharedConfig = defineConfig({
  srcDir: "src",
  srcExclude: [],
  outDir: "build",
  base: "/",
  head,
  lastUpdated: false,
  transformPageData(pageData) {
    pageData.frontmatter.head ??= [];

    if (pageData.frontmatter.canonical) {
      pageData.frontmatter.head.push([
        "link",
        {
          rel: "canonical",
          href: pageData.frontmatter.canonical,
        },
      ]);
    }

    // Add page-specific Open Graph and Twitter meta tags
    const title = pageData.frontmatter.title || pageData.title;
    const description =
      pageData.frontmatter.description ||
      pageData.description ||
      "A collection of high-performance JavaScript tools written in Rust";

    // Construct the canonical URL for the page
    let url = "https://oxc.rs";
    if (pageData.relativePath !== "index.md") {
      const path = pageData.relativePath.replace(/\.md$/, ".html").replace(/\/index\.html$/, "/");
      if (path !== "index.html") {
        url += "/" + path.replace(/^\/+/, "");
      }
    }

    if (title) {
      pageData.frontmatter.head.push(["meta", { property: "og:title", content: title }]);
      pageData.frontmatter.head.push(["meta", { name: "twitter:title", content: title }]);
    }

    if (description) {
      pageData.frontmatter.head.push([
        "meta",
        { property: "og:description", content: description },
      ]);
      pageData.frontmatter.head.push([
        "meta",
        { name: "twitter:description", content: description },
      ]);
    }

    pageData.frontmatter.head.push(["meta", { property: "og:url", content: url }]);
  },
  themeConfig: {
    variant: "oxc",

    banner: {
      id: latestBlog.link,
      text: `Announcing ${latestBlog.text}`,
      url: latestBlog.link,
    },

    siteTitle: "Oxc",
    logo: "https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/round.svg",
    search: {
      provider: "local",
      options: {
        async _render(src, env, md) {
          const html = await md.renderAsync(src, env);
          // Filter out pages with `search: false` in the frontmatter.
          if (env.frontmatter?.search === false) {
            return "";
          }

          // This is necessary because the page title for rules is stored
          // in `frontmatter.title` instead of in the markdown itself.
          // If we don't do this, the search index will not have the rule
          // name as a header.
          if (env.frontmatter?.title && !env.title) {
            return (await md.renderAsync(`# ${(env.frontmatter as any).title}`)) + html;
          }
          return html;
        },
      },
    },
    socialLinks: [
      { icon: "x", link: "https://x.com/OxcProject" },
      { icon: "bluesky", link: "https://bsky.app/profile/boshen.github.io" },
      { icon: "discord", link: "https://discord.gg/9uXCAwqQZW" },
      { icon: "github", link: "https://github.com/oxc-project/oxc" },
    ],
    lastUpdated: {
      formatOptions: {
        dateStyle: "full",
      },
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} VoidZero Inc. and Oxc contributors.`,
      nav: [
        {
          title: "Oxc",
          items: [
            { text: "Guide", link: "/docs/guide/introduction" },
            { text: "Learn", link: "/docs/learn/parser_in_rust/intro" },
            { text: "Contribute", link: "/docs/contribute/introduction" },
            { text: "Playground", link: "https://playground.oxc.rs" },
            { text: "Sponsor", link: "/sponsor" },
          ],
        },
        {
          title: "Tools",
          items: [
            { text: "Linter", link: "/docs/guide/usage/linter" },
            { text: "Formatter", link: "/docs/guide/usage/formatter" },
            { text: "Parser", link: "/docs/guide/usage/parser" },
            { text: "Transformer", link: "/docs/guide/usage/transformer" },
            { text: "Minifier", link: "/docs/guide/usage/minifier" },
            { text: "Resolver", link: "/docs/guide/usage/resolver" },
          ],
        },
        {
          title: "Resources",
          items: [
            { text: "Blog", link: BLOG_SIDEBAR[0].link },
            { text: "Team", link: "/team" },
          ],
        },
        /*{
          title: "Legal",
          items: [
            { text: "Terms & Conditions", link: "https://voidzero.dev/terms" },
            { text: "Privacy Policy", link: "https://voidzero.dev/privacy" },
            { text: "Cookie Policy", link: "https://voidzero.dev/cookies" },
          ],
        },*/
      ],
      social: [
        { icon: "github", link: "https://github.com/oxc-project/oxc" },
        { icon: "discord", link: "https://discord.gg/9uXCAwqQZW" },
        { icon: "x", link: "https://x.com/OxcProject" },
        { icon: "bluesky", link: "https://bsky.app/profile/boshen.github.io" },
      ],
    },
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    publicDir: resolve(dirname(fileURLToPath(import.meta.url)), "../../public"),
    optimizeDeps: {
      exclude: ["@docsearch/css"],
    },
    plugins: [groupIconVitePlugin(), llmstxt()],
    resolve: {
      alias: [
        {
          find: "@constants",
          replacement: resolve(dirname(fileURLToPath(import.meta.url)), "../theme/constants"),
        },
        {
          find: "@data",
          replacement: resolve(dirname(fileURLToPath(import.meta.url)), "../data"),
        },
      ],
    },
  },
});
