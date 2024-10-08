import * as React from 'react';
import { Flex, Input, Space, Switch } from 'antd';

import { useEmotionCss } from '../shared';
import { AppProps } from '../../utils/hooks/useApp';
import { CssSelectorSetting } from '../../utils/selector/css';

export interface ElementSettingsProps extends AppProps {
  className?: string;
  onClick: (type: keyof CssSelectorSetting, value: boolean | string) => void;
}

export default function ElementSettings({
  selected,
  config,
  onClick,
}: ElementSettingsProps) {
  const [attr, setAttr] = React.useState(!!config.settings?.attributes);
  const css = useEmotionCss();

  return (
    <Flex vertical gap={10}>
      <h4>Selector Settings</h4>
      <Space>
        <Switch
          checked={config.settings?.idName}
          onChange={(checked) => {
            onClick('idName', checked);
          }}
        />
        <span>选择 id</span>
      </Space>
      <Space>
        <Switch
          checked={config.settings?.className}
          onChange={(checked) => {
            onClick('className', checked);
          }}
        />
        <span>选择 class</span>
      </Space>
      <Space>
        <Switch
          checked={config.settings?.tagName}
          onChange={(checked) => {
            onClick('tagName', checked);
          }}
        />
        <span>选择 tag name</span>
      </Space>

      <Flex vertical gap={4}>
        <Space>
          <Switch
            checked={attr}
            onChange={(checked) => {
              setAttr(checked);
            }}
          />
          <span>选择 attributes</span>
        </Space>
        {!attr ? null : (
          <Space direction="vertical" size={4}>
            <span>
              attributes names，以<code>,</code>分隔
            </span>
            <Input.TextArea
              value={config.settings?.attributes}
              placeholder="data-test, aria-label"
              onChange={(e) => onClick('attributes', e.target.value)}
            />
          </Space>
        )}
      </Flex>
    </Flex>
  );
}
