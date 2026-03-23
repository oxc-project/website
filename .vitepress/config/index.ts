import { defineConfig } from "vitepress";

import { enConfig } from "./en";
import { rssConfig } from "./rss";
import { sharedConfig } from "./shared";

import { extendConfig } from "@voidzero-dev/vitepress-theme/config";
import taskLists from "markdown-it-task-lists";

export default extendConfig(
  defineConfig({
    ...sharedConfig,
    ...rssConfig,
    head: [...sharedConfig.head!, ...rssConfig.head!],
    locales: {
      ...enConfig,
    },
    markdown: {
      ...sharedConfig.markdown,
      config(md) {
        sharedConfig.markdown?.config?.(md);
        md.use(taskLists);
      },
    },
  }),
);
