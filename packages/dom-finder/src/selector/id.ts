import { sanitizeSelector } from './sanitize';

export const getElementId = (el: Element) => {
  const id = el.getAttribute('id');

  return id ? `#${sanitizeSelector(id)}` : '';
};
