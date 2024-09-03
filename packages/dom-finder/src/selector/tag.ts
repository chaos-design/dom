import { sanitizeSelector } from './sanitize';

export const getElementTag = (el: Element) => {
  return sanitizeSelector(el.tagName.toLowerCase());
};
