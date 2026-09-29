export const getRootNode = (element: Element) => {
  return element.ownerDocument.querySelector(':root');
};
