import React from 'react';
import c from '@chaos-design/classnames';
import { ShadowDom } from './components/shared';
import ShadowDomRoot from 'react-shadow';
import App, { AppProps } from './app';
import { createPortal } from 'react-dom';
import { css } from '@emotion/css';
import { EL_LIST_ATTR } from './utils/selector/const';
import { useLayoutEffect } from 'react';

export interface InspectorProps extends AppProps {}

export const inspectorStyles = `
  [${EL_LIST_ATTR}] {
    outline: 2px dashed #6366f1;
  }
`;

export const styles = `
  p {
    margin: 0;
  }

  h4 {
    margin: 0;
  }
`;

const Inspector = (props: InspectorProps) => {
  useLayoutEffect(() => {
    const style = document.createElement('style');
    style.id = 'chaos-inspector-style';
    style.innerHTML = inspectorStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {createPortal(
        <ShadowDomRoot.div
          className={c(
            'chaos-inspector',
            css`
              direction: ltr;
            `
          )}
        >
          <style>{styles}</style>
          <ShadowDom>
            <App {...props} />
          </ShadowDom>
        </ShadowDomRoot.div>,
        document.body
      )}
    </>
  );
};

export default Inspector;
