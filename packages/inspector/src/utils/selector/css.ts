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
  const attrs = config?.attributes?.split(',').map(i => i.trim()) || [];

  return {
    id: () => config?.idName ?? true,
    class: () => config?.className ?? true,
    tag: () => config?.tagName ?? true,
    attribute: (name: Attr) => attrs?.includes(name as any),
  };
};

export function generateCssSelector(
  element: Element,
  options?: CssSelectorConfig,
) {
  return getCssSelector(element, {
    ...options,
  }) as string;
}
