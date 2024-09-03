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
