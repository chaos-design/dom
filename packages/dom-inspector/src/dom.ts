export function isDOM(obj: any = {}) {
  return (
    typeof obj === 'object'
    && obj.nodeType === 1
    && typeof obj.style === 'object'
    && typeof obj.ownerDocument === 'object'
  );
}

export function $(selector, parent) {
  if (!parent) return document.querySelector(selector);
  if (isDOM(parent)) return parent.querySelector(selector);
  return document.querySelector(selector);
}

export function getZIndex() {
  return [...document.querySelectorAll('*')].reduce(
    (r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0),
    0,
  );
}

export const addRule = (selector, style) => {
  Object.keys(style).forEach((key: string) => {
    selector.style[key] = style[key];
  });
};

export function getDOMPosition(dom) {
  let computedStyle = getComputedStyle(dom);

  const rect: DOMRect = dom.getBoundingClientRect();

  let x = rect.left - Number.parseFloat(computedStyle['margin-left']);
  let y = rect.top - Number.parseFloat(computedStyle['margin-top']);

  let el = dom?.parent;

  while (el) {
    computedStyle = getComputedStyle(el);

    x
      += el?.frameElement.getBoundingClientRect().left
      - Number.parseFloat(computedStyle['margin-left']);
    y
      += el?.frameElement.getBoundingClientRect().top
      - Number.parseFloat(computedStyle['margin-top']);

    el = el?.parent;
  }

  return {
    top: y,
    left: x,
  };
}

export const getElementContainerStyle = (ele: HTMLElement) => {
  const result = {};

  const required = [
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'z-index',
  ];

  const computedStyle = getComputedStyle(ele);

  required.forEach((item) => {
    result[item] = Number.parseFloat(computedStyle[item] || 0);
  });

  return {
    ...result,
    width:
      ele.offsetWidth
      - result['border-left-width']
      - result['border-right-width']
      - result['padding-left']
      - result['padding-right'],
    height:
      ele.offsetHeight
      - result['border-top-width']
      - result['border-bottom-width']
      - result['padding-top']
      - result['padding-bottom'],
    ...getDOMPosition(ele),
  };
};
