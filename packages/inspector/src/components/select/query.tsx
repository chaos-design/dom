import React from 'react';
import { Flex, Input, Space } from 'antd';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
} from '@ant-design/icons';

import { useEmotionCss, Button } from '../shared';
import { copyTextToClipboard } from '../../utils/share';
import { AppConfig } from '../../utils/hooks/useApp';

export interface ElementQueryProps extends AppConfig {
  className?: string;
  handleSelectElement: (
    type: 'up' | 'down',
    e?: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
}

export default function ElementQuery({
  selected,
  config,
  handleSelectElement,
}: ElementQueryProps) {
  const css = useEmotionCss();

  return (
    <Flex justify="space-between" align="center" gap={10}>
      <Input
        prefix={
          <CopyOutlined
            className={css`
              cursor: pointer;
            `}
            onClick={() => {
              if (selected.selector) {
                copyTextToClipboard(selected.selector);
              }
            }}
          />
        }
        value={selected.selector}
        placeholder="Element Selector"
      />
      <Space>
        <Button
          type="text"
          icon={<ArrowUpOutlined />}
          disabled={config.disabled || !selected.selector}
          tooltipProps={{
            title: '上一个元素',
          }}
          onClick={(e) => {
            handleSelectElement('up', e);
          }}
        />
        <Button
          type="text"
          disabled={config.disabled || !selected.selector}
          icon={<ArrowDownOutlined />}
          tooltipProps={{
            title: '下一个元素',
          }}
          onClick={(e) => {
            handleSelectElement('down', e);
          }}
        />
      </Space>
    </Flex>
  );
}
