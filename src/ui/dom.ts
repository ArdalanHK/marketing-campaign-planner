export type Child = Node | string;
export type Attrs = Record<string, string | boolean | undefined>;

/**
 * Tiny element factory. String children become text nodes (never parsed as HTML),
 * which keeps every piece of user-supplied text safe from markup injection.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    node.setAttribute(name, value === true ? '' : value);
  }
  node.append(...children);
  return node;
}
