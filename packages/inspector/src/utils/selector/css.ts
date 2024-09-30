import type { CssSelectorConfig } from '@chaos-design/css-selector';
import getCssSelector from '@chaos-design/css-selector';

export const finder = getCssSelector;

export type { CssSelectorConfig };

export function generateCssSelector(
  element: Element,
  options?: CssSelectorConfig,
) {
  return getCssSelector(element, {
    ...options,
  }) as string;
}
