import type MarkdownIt from "markdown-it";

export function ruleReferencesMdPlugin(md: MarkdownIt): void {
  const parse = md.parse.bind(md);
  md.parse = (src: string, env: Record<string, unknown>) => {
    if (/^const source = `https:\/\/github\.com\/oxc-project\/oxc\/blob\//m.test(src)) {
      src = src.replace(/^<RuleReferences \/>$/m, '<RuleReferences :source="source" />');
    }
    return parse(src, env);
  };
}
