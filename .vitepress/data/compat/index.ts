import type { CompatData } from "./types";
import { frameworks } from "./frameworks";
import { oxfmtEntries, oxfmtTool } from "./oxfmt";
import { oxlintEntries, oxlintTool } from "./oxlint";

export const compatData: CompatData = {
  tools: [oxlintTool, oxfmtTool],
  frameworks,
  entries: [...oxlintEntries, ...oxfmtEntries],
};

export type {
  CompatData,
  CompatEntry,
  Framework,
  FrameworkCategory,
  SupportLevel,
  SupportStatus,
  Tool,
} from "./types";
