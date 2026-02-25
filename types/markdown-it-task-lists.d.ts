declare module "markdown-it-task-lists" {
  import type { PluginWithOptions } from "markdown-it";

  export interface MarkdownItTaskListOptions {
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
  }

  const markdownItTaskLists: PluginWithOptions<MarkdownItTaskListOptions>;

  export default markdownItTaskLists;
}
