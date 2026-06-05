import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp fmt --no-error-on-unmatched-pattern",
  },
  fmt: {
    ignorePatterns: [],
    embeddedLanguageFormatting: "auto",
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
