import { sanitizeSelector } from './sanitize';

export const attributeNodeToSelector = ({ name, value }: Attr) => {
  return `[${name}='${value}']`;
};

export const sanitizeAttributes = (attr: Attr) => {
  return {
    ...attr,
    name: sanitizeSelector(attr.name),
    value: sanitizeSelector(attr.value),
  };
};

export const getElementAttribute = (el: Element) => {
  const attrs: Attr[] = Array.from(el.attributes).map(sanitizeAttributes);

  // return [...attrs.map(attributeNodeToSelector)];
  return attrs;
};
