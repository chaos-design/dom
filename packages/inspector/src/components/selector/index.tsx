import { createPortal } from 'react-dom';
import { css as emotionCss } from '@emotion/css';
import c from '@chaos-design/classnames';
import { useEmotionCss } from '../shared/emotion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ElementRect,
  generateElementSelector,
  getElementPath,
  getElementRect,
} from '../../utils/dom/selector';
import { debounce } from '../../utils/helper';

import Highlighter from './highlighter';
import { SelectedProps } from '../../utils/hooks/useApp';
import { CssSelectorConfig } from '../../utils/selector/css';
import { findElementList } from '../../utils/dom/list';
import { EL_LIST_ATTR } from '../../utils/selector/const';

export interface SelectorProps {
  className?: string;
  disabled: boolean;
  single: boolean;
  dragging: boolean;
  selectorType: string;
  withAttributes?: boolean;
  selectedElements: ElementRect[];
  selectorSettings?: CssSelectorConfig;
  onSelected: (selector: SelectedProps) => void;
}

const OVERLAY_ID = 'chaos-inspector-overlay';
const SELECTED_OVERLAY_ID = 'chaos-inspector-selected-overlay';

export const IGNORE_TAG_LIST = ['SCRIPT', 'LINK', 'STYLE'];

function Selector(props: SelectorProps) {
  const {
    disabled,
    single,
    dragging,
    selectorType,
    withAttributes,
    selectedElements,
  } = props;

  const [elementState, setElementState] = useState<{
    hovered: ElementRect[];
    selected: ElementRect[];
  }>({
    hovered: [],
    selected: [],
  });
  const css = useEmotionCss();

  const mousePosition = useRef({ x: 0, y: 0 });

  let lastScrollPosY = window.scrollY;
  let lastScrollPosX = window.scrollX;

  let hoveredElements: Element[] = [];

  // console.log('props', props);

  const removeElementsList = useCallback(() => {
    const prevSelectedList = document.querySelectorAll('[automa-el-list]');
    prevSelectedList.forEach((el) => {
      el.removeAttribute(EL_LIST_ATTR);
    });
  }, []);

  const getElementRectWithOffset = useCallback(
    (
      element: Element,
      {
        withAttribute,
        withElOptions,
      }: { withAttribute?: boolean; withElOptions?: boolean }
    ) => {
      const rect = getElementRect(element, withAttribute);

      if (withElOptions && element.tagName === 'SELECT') {
        rect.options = Array.from(element.querySelectorAll('option')).map(
          (el) => ({
            value: el.value,
            name: el.innerText,
          })
        );
      }

      return rect;
    },
    [selectorType, single]
  );

  const retrieveElementsRect = useCallback(
    (
      {
        clientX,
        clientY,
        target: eventTarget,
        element,
      }: Pick<MouseEvent, 'clientX' | 'clientY'> & {
        element?: Element;
        target: MouseEvent['target'] & Element;
      },
      type: 'hovered' | 'selected'
    ) => {
      const isInspector = (element || eventTarget).classList.contains(
        'chaos-inspector'
      );

      if (dragging || disabled || isInspector) {
        return;
      }

      const isSelected = type === 'selected';
      const isSelectList = !single && selectorType === 'css';
      // console.log('retrieveElementsRect', { single, selectorType, isSelectList });

      let target = element;

      if (!target) {
        let { 1: point } = document.elementsFromPoint(clientX, clientY);

        target = point;
      }

      if (!target) {
        return;
      }

      let elementsRect: ElementRect[] = [];

      const withElOptions = type === 'selected';
      const withAttribute = withAttributes && isSelected;

      if (isSelectList) {
        const elements = findElementList(target) || [];

        if (!isSelected) {
          hoveredElements = elements;
        }

        elementsRect = elements.map((el) =>
          getElementRectWithOffset(el, { withAttribute, withElOptions })
        );
      } else {
        if (!isSelected) {
          hoveredElements = [target];
        }

        elementsRect = [
          getElementRectWithOffset(target, { withAttribute, withElOptions }),
        ];
      }

      setElementState((c) => ({
        ...c,
        [type]: elementsRect,
      }));

      if (isSelected) {
        const selector = generateElementSelector({
          selectorType,
          target,
          list: isSelectList,
          hoveredElements,
          selectorSettings: props.selectorSettings,
        });

        const selectedElements = elementsRect.reduce(
          (acc: ElementRect[], rect, index) => {
            if (rect.tagName !== 'SELECT') {
              return acc;
            }

            acc.push({ ...rect, elIndex: index });

            return acc;
          },
          []
        );

        props.onSelected({
          selector,
          selectedElement: target,
          selectedElements,
          elements: elementsRect,
          path: getElementPath(target),
        });
      }
    },
    [selectorType, single]
  );

  const onMousedown = useCallback(
    (e: any) => {
      if (e.target?.id === OVERLAY_ID) {
        e.preventDefault();
        e.stopPropagation();
      }

      retrieveElementsRect(e, 'selected');
    },
    [selectorType, single]
  );

  const onMousemove = useCallback(
    (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };

      retrieveElementsRect(e as any, 'hovered');
    },
    [selectorType, single]
  );

  const onScroll = useCallback(
    debounce(() => {
      if (disabled) {
        return;
      }

      hoveredElements = [];
      setElementState((c) => ({
        ...c,
        hovered: [],
      }));

      const xPos = window.screenX - lastScrollPosX;
      const yPos = window.screenY - lastScrollPosY;

      const newSelected = elementState.selected.map((s) => {
        return {
          ...s,
          x: s.x - xPos,
          y: s.y - yPos,
        };
      });

      setElementState((c) => ({
        ...c,
        selected: newSelected,
      }));

      lastScrollPosY = window.scrollY;
      lastScrollPosX = window.scrollX;
    }, 200),
    [selectorType, single]
  );

  const onKeydown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      e.preventDefault();

      const [highlightedElement] = hoveredElements;

      if (highlightedElement) {
        let newElement: Element | null = null;

        if (e.key === 'ArrowDown') {
          if (highlightedElement.firstElementChild) {
            newElement = highlightedElement.firstElementChild;
          } else {
            let sibling = highlightedElement;

            while (sibling) {
              if (sibling.nextElementSibling) {
                newElement = sibling.nextElementSibling;
                break;
              }

              sibling = sibling.parentNode as Element;
            }
          }
        } else if (e.key === 'ArrowUp') {
          if (highlightedElement.previousElementSibling) {
            newElement = highlightedElement.previousElementSibling;

            while (newElement.lastElementChild) {
              newElement = newElement.lastElementChild;
            }
          } else {
            newElement = highlightedElement.parentNode as Element;
          }
        }

        if (newElement && !IGNORE_TAG_LIST.includes(newElement!.tagName)) {
          // @ts-ignore
          const rect = newElement?.getBoundingClientRect();

          retrieveElementsRect(
            {
              clientX: rect.x,
              clientY: rect.y,
              target: newElement,
              element: newElement,
            },
            'hovered'
          );
        }
      }

      return;
    }

    if (e.code !== 'Space' || e.repeat) {
      return;
    }

    const { 1: selectedElement } = document.elementsFromPoint(
      mousePosition.current.x,
      mousePosition.current.y
    );

    if (selectedElement.id === SELECTED_OVERLAY_ID) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    retrieveElementsRect(
      {
        target: selectedElement,
        clientX: mousePosition.current.x,
        clientY: mousePosition.current.y,
      },
      'selected'
    );
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMousemove);
    document.addEventListener('mousedown', onMousedown);
    document.addEventListener('keydown', onKeydown);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mousedown', onMousedown);
      document.removeEventListener('keydown', onKeydown);
    };
  }, [selectorType, single]);

  useEffect(() => {
    if (selectedElements.length) {
      setElementState((c) => ({
        ...c,
        selected: selectedElements,
      }));
    }
  }, [selectedElements]);

  useEffect(() => {
    removeElementsList();
  }, [disabled, single]);

  if (disabled || dragging) {
    return null;
  }

  return (
    <>
      <svg
        className={c(
          'chaos-inspector-element-highlighter',
          css`
            height: 100%;
            width: 100%;
            top: 0px;
            left: 0px;
            pointer-events: none;
            position: fixed;
            z-index: 999999;
          `
        )}
      >
        <Highlighter
          elements={elementState.hovered}
          stroke-width="2"
          stroke="#fbbf24"
          fill="rgba(251, 191, 36, 0.1)"
        />
        <Highlighter
          elements={elementState.selected}
          stroke-width="2"
          stroke="#f87171"
          active-stroke="#f87171"
          fill="rgba(248, 113, 113, 0.1)"
          active-fill="rgba(248, 113, 113, 0.1)"
        />
      </svg>
      {!disabled &&
        createPortal(
          <div
            id={OVERLAY_ID}
            className={c(
              emotionCss`
              z-index: 9999999;
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            `
            )}
          />,
          document.body
        )}
    </>
  );
}

export default Selector;
