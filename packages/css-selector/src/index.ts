import CssSelector from './core';
import type { CssSelectorConfig } from './utils/options';

export { default as CssSelector } from './core';

let cssSelector: CssSelector;

export function getCssSelector(
  el: Element | Element[],
  config?: CssSelectorConfig,
) {
  if (!cssSelector) {
    cssSelector = new CssSelector(el, config);
  }

  return cssSelector.getCssSelectorList();
}

export default getCssSelector;
