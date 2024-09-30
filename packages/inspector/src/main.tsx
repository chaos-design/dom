import c from '@chaos-design/classnames';
import ShadowDom from './components/shared/shadow-dom';
import ShadowDomRoot from 'react-shadow';
import App from './app';
import { createPortal } from 'react-dom';
import { css } from '@emotion/css';
import { EL_LIST_ATTR } from './utils/selector/const';
import { useLayoutEffect } from 'react';

export interface InspectorProps {}

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

const Inspector = () => {
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
            <App />
          </ShadowDom>
        </ShadowDomRoot.div>,
        document.body
      )}
    </>
  );
};

export default Inspector;
