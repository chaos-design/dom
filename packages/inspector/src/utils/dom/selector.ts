import { EL_LIST_ATTR } from '../selector/const';
import type { CssSelectorConfig } from '../selector/css';
import { generateCssSelector } from '../selector/css';
import { generateXPath } from '../selector/xpath';

export const createElement = (tag: string, container: Node = document) => {
  const element = document.createElement(tag);
  container.appendChild(element);

  return element;
};

export const removeElementByAttr = (element: Element) => {
  if (element) {
    element.remove();
  }
};

export interface ElementRect extends Record<string, any> {
  x: number;
  y: number;
  width: number;
  height: number;

  tagName?: string;
  elIndex?: number;
  outline?: string | number;
  highlight?: boolean;
}

export function getElementRect(
  target: Element,
  withAttributes?: boolean,
): ElementRect {
  if (!target) {
    return {} as ElementRect;
  }

  const { x, y, height, width } = target.getBoundingClientRect();
  const result: ElementRect = {
    width: width + 4,
    height: height + 4,
    x: x - 2,
    y: y - 2,
    tagName: target?.tagName,
  };

  if (withAttributes) {
    const attributes: Partial<Element['attributes']> & Record<string, any> = {};

    Array.from(target.attributes).forEach(({ name, value }) => {
      if (name === EL_LIST_ATTR) {
        return;
      }

      attributes[name] = value;
    });

    result.attributes = attributes;
    // result.tagName = target.tagName;
  }

  return result;
}

export const generateElementSelector = ({
  selectorType,
  target,
  list,
  hoveredElements = [],
  selectorSettings,
}: {
  selectorType: string;
  target: Element;
  list?: boolean;
  hoveredElements?: Element[];
  selectorSettings?: CssSelectorConfig;
}) => {
  let selector = '';

  const [selectedElement] = hoveredElements;

  if (list) {
    const isInList = target.closest(`[${EL_LIST_ATTR}]`);

    if (isInList) {
      const childSelector = generateCssSelector(target, {
        root: isInList,
        ...(selectorSettings || {}),
      });
      const listSelector = isInList.getAttribute(EL_LIST_ATTR);

      selector = `${listSelector} > ${childSelector}`;
    } else {
      const parentSelector = generateCssSelector(
        selectedElement.parentElement as Element,
        {
          ...(selectorSettings || {}),
        },
      );

      selector = `${parentSelector} > ${selectedElement.tagName.toLowerCase()}`;

      const prevSelectedList = document.querySelectorAll(`[${EL_LIST_ATTR}]`);

      prevSelectedList.forEach((el) => {
        el.removeAttribute(EL_LIST_ATTR);
      });

      hoveredElements.forEach((el) => {
        el.setAttribute(EL_LIST_ATTR, selector);
      });
    }
  } else {
    selector
      = selectorType === 'css'
        ? generateCssSelector(target, selectorSettings)
        : generateXPath(target) ?? '';
  }

  return selector || '';
};

export const getElementPath = (element: Element, root = document) => {
  const path: Element[] = [element];
  let current = element.parentNode;

  while (current && !current.isEqualNode(root)) {
    // @ts-expect-error
    path.push(current);

    current = current.parentNode;
  }
  return path;
};
