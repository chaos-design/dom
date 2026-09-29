import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useApp } from './utils/hooks/useApp';
import Inspector, { InspectorProps } from './main';
export interface ContainerConfig {
  className?: string;
}

const MOUNT_CONTAINER = 'MOUNT_CONTAINER';

export const mountContainer = new Map<string, HTMLElement>();

export const getContainer = (
  container: Element = document.body,
  config: ContainerConfig = {}
) => {
  if (mountContainer.has(MOUNT_CONTAINER)) {
    return mountContainer.get(MOUNT_CONTAINER);
  }

  const div = document.createElement('div');

  div.classList.add('chaos-inspector-container');

  if (config.className) {
    div.classList.add(config.className);
  }

  mountContainer.set(MOUNT_CONTAINER, div);
  container.appendChild(div);

  return div;
};

export const mountInspector = (
  dom: Element,
  {
    inspector,
    containerConfig,
  }: { inspector?: InspectorProps; containerConfig?: ContainerConfig } = {}
) => {
  if (!dom.isConnected || !document) {
    return {
      unmount() {},
    };
  }

  let render;

  if (typeof ReactDOM.createRoot === 'function') {
    render = (element: React.ReactNode) => {
      const root = ReactDOM.createRoot(
        getContainer(dom, containerConfig) as HTMLElement
      );
      root.render(element);

      return () => {
        root.unmount();
      };
    };
  } else {
    render = (element: React.ReactNode) => {
      return () => {};
    };
  }

  const unmount = render(<Inspector {...inspector} />);

  return {
    unmount,
  };
};

export const useInspector = (
  dom: Element,
  config: { inspector?: InspectorProps; containerConfig?: ContainerConfig } = {}
) => {
  const app = useApp();

  useEffect(() => {
    if (!dom?.isConnected) {
      return () => {};
    }

    const { unmount } = mountInspector(dom, config);

    return () => {
      unmount();
    };
  }, [dom?.isConnected]);

  return app;
};
