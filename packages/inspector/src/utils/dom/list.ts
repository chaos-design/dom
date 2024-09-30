import { EL_LIST_ATTR } from '../selector/const';
import { generateCssSelector } from '../selector/css';

export function getAllSiblings(el: Element, selector: string) {
  const siblings = [el];

  const validateElement = (element: Element) => {
    const isValidSelector = selector ? element.querySelector(selector) : true;
    const isSameTag = el.tagName === element.tagName;

    return isValidSelector && isSameTag;
  };

  let nextSibling = el;
  let prevSibling = el;
  let elementIndex = 1;

  // @ts-expect-error
  while ((prevSibling = prevSibling?.previousElementSibling)) {
    if (validateElement(prevSibling)) {
      elementIndex += 1;

      siblings.unshift(prevSibling);
    }
  }

  // @ts-expect-error
  while ((nextSibling = nextSibling?.nextElementSibling)) {
    if (validateElement(nextSibling)) {
      siblings.push(nextSibling);
    }
  }

  return {
    elements: siblings,
    index: elementIndex,
  };
}

export const getElementList = (
  el: Element,
  maxDepth: number = 500,
  paths: string[] = [],
) => {
  if (maxDepth === 0 || !el || el.tagName === 'BODY') {
    return null;
  }

  let selector = el.tagName.toLowerCase();

  const { elements, index } = getAllSiblings(el, paths.join(' > '));

  let siblings = elements;

  if (index !== 1) {
    selector += `:nth-of-type(${index})`;
  }

  paths.unshift(selector);

  if (siblings.length === 1) {
    // @ts-expect-error
    siblings = getElementList(el?.parentElement, maxDepth - 1, paths);
  }

  return siblings;
};

export const findElementList = (
  target: Element,
  props: {
    selectorSettings?: Record<string, any>;
  } = {},
) => {
  if (!target) {
    return [];
  }

  const listEl = target.closest(`[${EL_LIST_ATTR}]`);

  if (listEl) {
    if (target.hasAttribute(EL_LIST_ATTR)) {
      return [];
    }

    const selector = generateCssSelector(target, {
      root: listEl,
      ...(props?.selectorSettings || {}),
      id: () => false,
    });

    const elements = document.querySelectorAll(`${EL_LIST_ATTR} ${selector}`);

    return Array.from(elements);
  }

  return getElementList(target) || [target];
};
