import CssSelector from './core';
import type { CssSelectorConfig } from './utils/options';

export { default as CssSelector } from './core';

export { CssSelectorConfig };

let cssSelector: CssSelector;

export function getCssSelector(
  el: Element | Element[],
  config?: CssSelectorConfig,
) {
  const cssSelector = new CssSelector(config);

  return cssSelector.getCssSelectorList(el);
}

export default getCssSelector;
