import { Flex, Input, Space } from 'antd';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
} from '@ant-design/icons';

import { useEmotionCss, Button } from '../shared';
import { AppProps } from '../../utils/hooks/useApp';
import { copyTextToClipboard } from '../../utils/share';

export interface ElementQueryProps extends AppProps {
  className?: string;
  onClick: (type: 'up' | 'down') => void;
}

export default function ElementQuery({
  selected,
  config,
  onClick,
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
          onClick={() => {
            onClick('up');
          }}
        />
        <Button
          type="text"
          disabled={config.disabled || !selected.selector}
          icon={<ArrowDownOutlined />}
          tooltipProps={{
            title: '下一个元素',
          }}
          onClick={() => {
            onClick('down');
          }}
        />
      </Space>
    </Flex>
  );
}
