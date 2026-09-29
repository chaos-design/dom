import { isElement } from '@chaos-design/dom-finder';

export const isEmpty = <T>(el: T, index: number, elements: T[]) => {
  return el === undefined || el === null;
};

export const isNotEmpty = <T>(el: T, index: number, elements: T[]) => {
  return el !== undefined && el !== null;
};

export const sanitizeElements = (el: unknown): Element[] => {
  if (el instanceof NodeList || el instanceof HTMLCollection) {
    el = Array.from(el);
  }

  const elements = (Array.isArray(el) ? el : [el]).filter(isElement);

  return [...new Set(elements)];
};
