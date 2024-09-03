import { isElement } from './element';
import { getRootNode } from './root';

export const getElementParents = (element: Element, root?: Element) => {
  root = root ?? getRootNode(root);
  const result = [];

  let parent = element;
  while (isElement(parent) && parent !== root) {
    result.push(parent);
    parent = parent.parentNode as Element;
  }

  return result;
};

export interface ElementParentOptions {
  root?: Element;
  maxCandidates?: number;
}

export type MatchParent = Element | ((element: Element) => boolean);

export const getElementParent = (
  element: Element,
  options: ElementParentOptions,
): Element | null => {
  const { root = document.body, maxCandidates } = options || {};
  let counter = 0;

  let currentElement: Element | null = element;

  while (currentElement && currentElement !== root) {
    if (maxCandidates && counter === maxCandidates) {
      break;
    }

    maxCandidates && counter++;
    currentElement = element.parentNode as Element;
  }

  return currentElement;
};

export const hasElementMatchParentByCandidates = (
  element: Element,
  match: MatchParent,
  options: ElementParentOptions,
) => {
  if (typeof match == 'function') {
    return match(getElementParent(element, options));
  }

  return getElementParent(element, options) === match;
};

export const getElementMatchParentCandidates = (
  element: Element,
  match: MatchParent,
  options: ElementParentOptions,
) => {
  const { root = document.body, maxCandidates } = options || {};
  let counter = 0;
  let matched = false;

  let currentElement: Element | null = element;

  while (currentElement && currentElement !== root) {
    if (
      typeof match == 'function'
        ? match(currentElement)
        : match === currentElement
    ) {
      matched = true;
      break;
    }

    if (maxCandidates && counter === maxCandidates) {
      break;
    }

    counter++;

    currentElement = element.parentNode as Element;
  }

  return matched ? counter : -1;
};
