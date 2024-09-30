export function generateXPath(
  element: Element,
  root = document.body,
): string | null {
  if (!element) {
    return null;
  }

  if (element.id !== '') {
    return `id("${element.id}")`;
  }

  if (element === root) {
    return `//${element.tagName}`;
  }

  let pos = 0;
  const siblings = (element.parentNode as Element).childNodes;

  for (let index = 0; index < siblings.length; index += 1) {
    const sibling = siblings[index] as Element;

    if (sibling === element) {
      return `${generateXPath(element.parentNode as Element)}/${
        element.tagName
      }[${pos + 1}]`;
    }

    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      pos += 1;
    }
  }

  return null;
}
