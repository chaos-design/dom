// import { sanitizeSelector } from './sanitize';

export const getElementClassList = (el: Element) => {
  return !el.getAttribute('class')
    ? []
    : el.getAttribute('class').trim().split(/\s+/); // .map(name => `.${name}`).map(sanitizeSelector);
};
