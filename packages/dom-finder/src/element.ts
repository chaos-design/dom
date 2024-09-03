export const isElement = (el: unknown): el is Element => {
  return (
    typeof el === 'object'
    && el !== null
    && (el as Element).nodeType === Node.ELEMENT_NODE
  );
};
