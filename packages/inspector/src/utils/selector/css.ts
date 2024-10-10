import type { CssSelectorConfig } from '@chaos-design/css-selector';
import getCssSelector from '@chaos-design/css-selector';

export const finder = getCssSelector;

export type { CssSelectorConfig };

export interface CssSelectorSetting {
  idName?: boolean;
  className?: boolean;
  tagName?: boolean;
  attributes?: string;
}

export const getCssSelectorConfig = (config: CssSelectorSetting = {}) => {
  const attrs = config?.attributes?.split(',').map((i) => i.trim()) || [];

  return {
    id: () => config?.idName ?? true,
    class: () => config?.className ?? true,
    tag: () => config?.tagName ?? true,
    attribute: (attr: Attr) => attrs?.includes(attr?.name),
  };
};

export const ARIA_ATTRS = ['data-test'];

export function generateCssSelector(
  element: Element,
  options?: CssSelectorConfig
) {
  let selector = getCssSelector(element, {
    tag: () => true,
    attribute: ({ name, value }) =>
      name === 'id' || Boolean(ARIA_ATTRS.includes(name) && value),
    ...options,
  }) as string;

  const tag = element?.tagName.toLowerCase();
  if (tag && !selector.startsWith(tag) && !selector.includes(' ')) {
    selector = `${tag}${selector}`;
  }

  return selector;
}
