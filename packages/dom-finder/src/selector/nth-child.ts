export const getNthIndex = (el: Element) => {
  const parent = el.parentNode;

  if (!parent) {
    return null;
  }

  let child = parent.firstChild;

  if (!child) {
    return null;
  }

  let i = 0;

  while (child) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      i++;
    }

    if (child.isEqualNode(el)) {
      break;
    }

    child = child.nextSibling;
  }

  return i;
};

export function getElementNthChild(element: Element) {
  const index = getNthIndex(element);

  return index !== undefined || index !== null ? `:nth-child(${index})` : '';
}
