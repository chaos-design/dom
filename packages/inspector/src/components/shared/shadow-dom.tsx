import React from 'react';
import { App, ConfigProvider } from 'antd';
import { useShadowRoot } from 'react-shadow';
import { StyleProvider } from '@ant-design/cssinjs';
import { EmotionCssProvider } from './emotion';

interface ShadowDomProps {
  children: React.ReactNode;
}

const ShadowDom: React.FC<ShadowDomProps> = ({ children }) => {
  const container = useShadowRoot();

  return (
    <EmotionCssProvider container={container as any}>
      <StyleProvider container={container as any}>
        <ConfigProvider>
          <App>{children}</App>
        </ConfigProvider>
      </StyleProvider>
    </EmotionCssProvider>
  );
};

export default ShadowDom;
