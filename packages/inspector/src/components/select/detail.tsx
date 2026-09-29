import { CopyOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps, Flex, Input, Segmented } from 'antd';
import React, { useMemo, useState } from 'react';
import { ElementRect } from '../../utils/dom/selector';
import { AppConfig } from '../../utils/hooks/useApp';
import { copyTextToClipboard } from '../../utils/share';
import { useEmotionCss } from '../shared';

export interface ElementDetailProps extends AppConfig {
  className?: string;
  handleHighlight: (props: {
    highlight: boolean;
    index: number;
    element: ElementRect;
    event?: React.MouseEvent<HTMLElement, MouseEvent>;
  }) => void;
}

export default function ElementDetail({
  selected,
  handleHighlight,
}: ElementDetailProps) {
  const [activeTab, setActiveTab] = useState('Attributes');
  const css = useEmotionCss();

  const selectedElements = useMemo(() => {
    if (!selected.selector) {
      return [];
    }

    const elements = selected.selectedElements
      .map((el, index) => {
        return {
          key: index,
          label: `#${index + 1} Element`,
          children: !(Object.keys(el.attributes).length > 0) ? null : (
            // biome-ignore lint/a11y/noStaticElementInteractions: 属性列表仅用于驱动 inspector 的 hover 高亮，不是可交互控件，添加 role 反而会误导读屏软件
            <div
              onMouseEnter={(event) => {
                handleHighlight({ highlight: true, index, element: el, event });
              }}
              onMouseLeave={(event) => {
                handleHighlight({
                  highlight: false,
                  index,
                  element: el,
                  event,
                });
              }}
            >
              {Object.keys(el.attributes).map((key) => {
                return (
                  <div
                    key={key}
                    className={css`
                      background-color: rgba(0, 0, 0, 0.05);
                      border-radius: 8px;
                      padding: 8px;
                      margin-bottom: 8px;
                    `}
                  >
                    <div
                      className={css`
                        color: #52525b;
                      `}
                    >
                      {key}
                    </div>
                    <Input
                      className={css`
                        background-color: rgba(0, 0, 0, 0.05);
                        border-radius: 8px;
                        padding: 8px;
                      `}
                      prefix={
                        <CopyOutlined
                          className={css`
                            cursor: pointer;
                          `}
                          onClick={() => {
                            if (el.attributes[key]) {
                              copyTextToClipboard(el.attributes[key]);
                            }
                          }}
                        />
                      }
                      value={el.attributes[key]}
                    />
                  </div>
                );
              })}
            </div>
          ),
        };
      })
      .filter(Boolean);

    return elements;
  }, [selected.selector]);

  return (
    <Flex justify="space-between" align="center" gap={10}>
      <Flex vertical flex={1}>
        <Segmented<string>
          value={activeTab}
          options={['Attributes']}
          onChange={(value) => {
            setActiveTab(value);
          }}
        />
        <div
          className={css`
            max-height: 280px;
            overflow: auto;
          `}
        >
          <Collapse
            activeKey={
              selectedElements?.map((e) => e?.key) as CollapseProps['activeKey']
            }
            ghost
            expandIcon={() => null}
            className={css`
              .ant-collapse-item ant-collapse-header {
                padding-left: 0;
                padding-right: 0;
              }

              .ant-collapse-item .ant-collapse-content-box {
                padding: 0 !important;
              }

              .ant-collapse-header {
                padding-left: 0 !important;
              }
            `}
            items={selectedElements as CollapseProps['items']}
          />
        </div>
      </Flex>
    </Flex>
  );
}
