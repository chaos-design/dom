import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import c from '@chaos-design/classnames';
import { Flex, Select, Space } from 'antd';
import {
  CloseOutlined,
  DragOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import { useEmotionCss, Button } from './components/shared';
import {
  Selector,
  ElementQuery,
  ElementDetail,
  ElementSettings,
} from './components/select';

import { SelectedProps, useApp } from './utils/hooks/useApp';
import {
  ElementRect,
  generateElementSelector,
  getElementRect,
} from './utils/dom/selector';
import { getCssSelectorConfig } from './utils/selector/css';
import { observer } from 'mobx-react-lite';

export interface ContentProps {
  className?: string;
}

export const IGNORE_TAG_LIST = ['SCRIPT', 'LINK', 'STYLE'];

export interface SelectElementProps {
  path: Element[];
  pathIndex: number;
  cache?: WeakMap<Element, Element>;
}

function App() {
  const { config, setAppValue, selected, ...appConfig } = useApp();
  const [cardRect, setCardRect] = useState<{
    x: number;
    y: number;
    height: number;
    width: number;
  }>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  const css = useEmotionCss();

  const containerRef = useRef<HTMLDivElement>(null);
  const selectElement = useRef<SelectElementProps>({
    path: [],
    pathIndex: 0,
    cache: new WeakMap(),
  });

  const destroy = useCallback(() => {
    setAppValue(
      { disabled: true, selectorType: config.selectorType },
      'config'
    );
    setAppValue(
      {
        selector: '',
        selectedElements: [],
      },
      'selector'
    );
  }, []);

  const onSelected = useCallback((selected: SelectedProps) => {
    const { path } = selected || {};

    if (path) {
      selectElement.current.path = path;
      selectElement.current.pathIndex = 0;
    }

    setAppValue(selected, 'selector');
  }, []);

  const getSelectElementPath = useCallback(
    (type: 'up' | 'down', e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const forward = type === 'up';

      let pathIndex = forward
        ? selectElement.current.pathIndex + 1
        : selectElement.current.pathIndex - 1;

      let element = selectElement.current.path[pathIndex];

      if ((forward && !element) || element?.tagName === 'BODY') {
        return;
      }

      if (!forward && !element) {
        const previousElement =
          selectElement.current.path[selectElement.current.pathIndex];

        const child = Array.from(previousElement.children).find(
          (el) => !['SCRIPT', 'LINK', 'STYLE'].includes(el.tagName)
        );

        if (!child) {
          return;
        }

        element = child;
        selectElement.current.path.unshift(child);
        pathIndex = 0;
      }

      selectElement.current.pathIndex = pathIndex;

      setAppValue(
        {
          selectedElements: [getElementRect(element, true)],
          selector: generateElementSelector({
            selectorType: config.selectorType,
            target: element,
            list: config.single && config.selectorType === 'css',
            hoveredElements: [element],
            selectorSettings: getCssSelectorConfig(config.settings),
          }),
        },
        'selector'
      );
    },
    [config.selectorType, config.single, config.settings]
  );

  const onMouseup = useCallback(() => {
    if (config.dragging) {
      setAppValue({ dragging: false });
    }
  }, [config.dragging]);

  const onMousemove = useCallback(
    (e: MouseEvent) => {
      if (!config.dragging) {
        return;
      }

      let { clientX, clientY } = e;

      const height = window.innerHeight;
      const width = document.documentElement.clientWidth;

      if (clientY < 20) {
        clientY = 20;
      } else if (cardRect.height + clientY > height) {
        clientY = height - cardRect.height;
      }

      if (clientX < 20) {
        clientX = 20;
      } else if (cardRect.width + clientX > width) {
        clientX = width - cardRect.width;
      }

      cardRect.x = clientX;
      cardRect.y = clientY;

      setCardRect((c) => ({
        ...c,
        ...cardRect,
        x: clientX,
        y: clientY,
      }));
    },
    [config.dragging]
  );

  const handleHighlight = useCallback(
    (props: {
      highlight: boolean;
      index: number;
      element: ElementRect;
      event?: React.MouseEvent<HTMLElement, MouseEvent>;
    }) => {
      const { highlight, index } = props || {};

      const selectedElements = selected.selectedElements.map((e, i) => {
        if (i === index) {
          return {
            ...e,
            highlight,
          };
        }

        return e;
      });

      setAppValue(
        {
          selectedElements,
        },
        'selector'
      );
    },
    [selected]
  );

  const cardElementObserver = new ResizeObserver(([entry]) => {
    const { height, width } = entry.contentRect;

    setCardRect((c) => ({
      ...c,
      width,
      height,
    }));
  });

  useEffect(() => {
    cardElementObserver.observe(containerRef.current!);

    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('mousemove', onMousemove);

    return () => {
      cardElementObserver.disconnect();

      window.removeEventListener('mouseup', onMouseup);
      window.removeEventListener('mousemove', onMousemove);
    };
  }, [config.dragging]);

  useLayoutEffect(() => {
    setTimeout(() => {
      const { height, width } = containerRef.current!.getBoundingClientRect();

      const rect = {
        x: window.innerWidth - (width + 35),
        y: 20,
        width: width,
        height: height,
      };

      setCardRect(rect);
    }, 500);
  }, []);

  useEffect(() => {
    document.body.toggleAttribute(
      'chaos-inspector-isDragging',
      config.dragging
    );
  }, [config.dragging]);

  // @ts-ignore
  window._inspector = {
    config,
    selected,
    appConfig,
  };

  return (
    <>
      <div
        className={c(
          'root-card',
          css`
            position: fixed;
            height: 100%;
            width: 100%;
            right: 0;
            top: 0;
            pointer-events: none;
            z-index: 99999999;
            ${config.disabled ? '' : 'background: rgba(0, 0, 0, 0.3);'}
            ${!config.dragging ? '' : 'user-select: none;'}
          `
        )}
      >
        <div
          ref={containerRef}
          className={c(
            css`
              width: 350px;
              position: relative;
              background: #fff;
              box-shadow: 0 0 25px -5px rgb(0 0 0 / 0.1),
                0 0 10px -6px rgb(0 0 0 / 0.1);
              border-radius: 8px;
              pointer-events: auto;
              z-index: 50;

              &:hover {
                .drag-button {
                  transform: scale(1);
                }
              }
            `
          )}
          style={{
            transform: `translate(${cardRect.x}px, ${cardRect.y}px)`,
          }}
        >
          <Button
            className={c(
              'drag-button',
              css`
                position: absolute;
                top: -15px;
                left: -15px;
                cursor: move;
                z-index: 55;
                transform: scale(0);
                transition: transform 200ms ease-in-out;
              `
            )}
            icon={<DragOutlined />}
            onBlur={() => {
              setAppValue({
                dragging: false,
              });
            }}
            onMouseDown={() => {
              setAppValue({
                dragging: true,
              });
            }}
          />
          <Flex
            justify="space-between"
            align="center"
            gap={10}
            className={css`
              padding: 16px;
              padding-bottom: 0;
            `}
          >
            <Space>
              <h4>Inspector</h4>
            </Space>
            <Space>
              <Button
                type="text"
                tooltipProps={{
                  title: !config.disabled ? '关闭浮层' : '开启浮层',
                }}
                icon={
                  !config.disabled ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                onClick={() => {
                  setAppValue({
                    disabled: !config.disabled,
                  });
                }}
              />
              {/* <Button
                type="text"
                disabled={config.disabled}
                tooltipProps={{
                  title: '隐藏',
                }}
                icon={<FullscreenExitOutlined />}
                onClick={() => {
                  destroy();
                }}
              /> */}
            </Space>
          </Flex>
          <Flex
            vertical
            gap={10}
            className={css`
              padding: 16px;
            `}
          >
            <Flex justify="space-between" align="center" gap={10}>
              <Select
                value={config.selectorType}
                defaultValue={'css'}
                style={{
                  width: '100%',
                }}
                disabled={!config.single || config.disabled}
                options={[
                  {
                    label: 'CSS Selector',
                    value: 'css',
                  },
                  {
                    label: 'XPath',
                    value: 'xpath',
                  },
                ]}
                getPopupContainer={(node) => node.parentNode}
                onChange={(value) => {
                  setAppValue({
                    selectorType: value,
                  });
                }}
              />
              {config.selectorType === 'xpath' ? null : (
                <Space>
                  <Button
                    disabled={config.disabled}
                    icon={
                      <UnorderedListOutlined
                        style={{
                          color: !config.single ? '#1966ff' : '',
                        }}
                      />
                    }
                    tooltipProps={{
                      title: !config.single ? '单选元素' : '多选元素',
                    }}
                    type="text"
                    onClick={() => {
                      setAppValue({
                        single: !config.single,
                      });
                    }}
                  />
                  <Button
                    type="text"
                    disabled={config.disabled}
                    icon={
                      !config.setting ? <SettingOutlined /> : <CloseOutlined />
                    }
                    tooltipProps={{
                      title: 'CSS选择器设置',
                    }}
                    onClick={() => {
                      setAppValue({
                        setting: !config.setting,
                      });
                    }}
                  />
                </Space>
              )}
            </Flex>
            {config.setting && config.selectorType === 'css' ? (
              <ElementSettings
                selected={selected}
                config={config}
                onClick={(name, value) => {
                  setAppValue(
                    {
                      settings: {
                        ...config.settings,
                        [name]: value,
                      },
                    },
                    'config'
                  );
                }}
              />
            ) : (
              <>
                <ElementQuery
                  selected={selected}
                  config={config}
                  handleSelectElement={getSelectElementPath}
                />
                {selected.selector && (
                  <ElementDetail
                    selected={selected}
                    config={config}
                    handleHighlight={handleHighlight}
                  />
                )}
              </>
            )}
            <Flex>
              <Space>
                <p>
                  点击或者按&nbsp;
                  <kbd
                    className={c(css`
                      background-color: #eee;
                      border-radius: 3px;
                      border: 1px solid #b4b4b4;
                      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
                        0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
                      color: #333;
                      display: inline-block;
                      font-size: 0.85em;
                      font-weight: 700;
                      line-height: 1;
                      padding: 2px 4px;
                      white-space: nowrap;
                    `)}
                  >
                    Space
                  </kbd>
                  &nbsp;或者&nbsp;
                  <kbd
                    className={c(css`
                      background-color: #eee;
                      border-radius: 3px;
                      border: 1px solid #b4b4b4;
                      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
                        0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
                      color: #333;
                      display: inline-block;
                      font-size: 0.85em;
                      font-weight: 700;
                      line-height: 1;
                      padding: 2px 4px;
                      white-space: nowrap;
                    `)}
                  >
                    Enter
                  </kbd>{' '}
                  选择一个元素
                </p>
              </Space>
            </Flex>
          </Flex>
        </div>
      </div>
      <Selector
        {...config}
        selectorSettings={config.settings}
        selectedElements={selected.selectedElements}
        onSelected={onSelected}
        withAttributes
      />
    </>
  );
}

export default observer(App);
