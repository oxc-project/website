export type SupportLevel = "full" | "partial" | "none" | "n/a";

export interface Source {
  title: string;
  url: string;
}

export interface SupportStatus {
  level: SupportLevel;
  notes?: string;
  noteId?: number;
  sources?: Source[];
}

export type FrameworkCategory = "base" | "frontend" | "meta-framework" | "mobile" | "file-type";

export interface Framework {
  id: string;
  name: string;
  category: FrameworkCategory;
  icon: string;
  website?: string;
}

export interface ToolFeature {
  id: string;
  name: string;
  description: string;
}

export interface Tool {
  id: "oxlint" | "oxfmt";
  name: string;
  description: string;
  features: ToolFeature[];
}

export interface CompatEntry {
  frameworkId: string;
  toolId: "oxlint" | "oxfmt";
  featureId: string;
  status: SupportStatus;
}

export interface CompatData {
  tools: Tool[];
  frameworks: Framework[];
  entries: CompatEntry[];
}
