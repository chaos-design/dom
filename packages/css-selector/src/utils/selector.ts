import { isElement } from '@chaos-design/dom-finder';

export const getIntersection = <T>(item: T[][] = []): T[] => {
  const [first, ...rest] = item;

  if (rest.length === 0) {
    return first;
  }

  return rest.reduce((prev, curr) => {
    return prev.filter((item: T) => curr.includes(item));
  }, first);
};

export const sanitizeElements = (el: unknown): Element[] => {
  if (el instanceof NodeList || el instanceof HTMLCollection) {
    el = Array.from(el);
  }

  const elements = (Array.isArray(el) ? el : [el]).filter(isElement);

  return [...new Set(elements)];
};

export const ESCAPED_COLON = ':'.charCodeAt(0).toString(16).toUpperCase();
export const SPECIAL_CHARACTERS_RE = /[ !"#$%&'()\[\]{|}<>*+,./;=?@^`~\\]/;

/**
 * https://github.com/mathiasbynens/CSS.escape
 */
export const legacyCSSEscape = (input: string) => {
  return input
    .split('')
    .map((character) => {
      if (character === ':') {
        return `\\${ESCAPED_COLON} `;
      }
      if (SPECIAL_CHARACTERS_RE.test(character)) {
        return `\\${character}`;
      }
      return escape(character).replace(/%/g, '\\');
    })
    .join('');
};

export const sanitizeSelector = (input: string) => {
  return CSS ? CSS.escape(input) : legacyCSSEscape(input);
};
