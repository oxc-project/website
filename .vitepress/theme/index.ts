import "virtual:group-icons.css";
import type { Theme } from "vitepress";
import OxcTheme from "@voidzero-dev/vitepress-theme/src/oxc";
import AppBlogPostHeader from "./components/AppBlogPostHeader.vue";
import AppBlogList from "./components/AppBlogList.vue";
import RulesTable from "./components/RulesTable.vue";
import RuleHeader from "./components/RuleHeader.vue";
import RuleReferences from "./components/RuleReferences.vue";
import Alert from "./components/Alert.vue";
import CompatibilityMatrix from "./components/CompatibilityMatrix.vue";
import "./styles.css";

export default {
  extends: OxcTheme as unknown as any,
  async enhanceApp({ app }) {
    app.component("Alert", Alert);
    app.component("CompatibilityMatrix", CompatibilityMatrix);
    app.component("AppBlogPostHeader", AppBlogPostHeader);
    app.component("AppBlogList", AppBlogList);
    app.component("RulesTable", RulesTable);
    app.component("RuleHeader", RuleHeader);
    app.component("RuleReferences", RuleReferences);
  },
} satisfies Theme;
