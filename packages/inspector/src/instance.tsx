import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Inspector, { InspectorProps } from './main';
import { useApp } from './utils/hooks/useApp';
export interface ContainerConfig {
  className?: string;
}

const MOUNT_CONTAINER = 'MOUNT_CONTAINER';

export const mountContainer = new Map<string, HTMLElement>();

/**
 * 容器 -> 已创建的 React root。
 *
 * StrictMode 下 effect 会 mount -> cleanup -> mount 连续执行，
 * 而 cleanup 里的 unmount 必须推迟到微任务（同步 unmount 会落在 React 渲染阶段并触发告警），
 * 于是第二次 mount 发生时上一个 root 尚未销毁，此时必须复用而非重新 createRoot。
 */
const rootByContainer = new WeakMap<
  Element,
  ReturnType<typeof ReactDOM.createRoot>
>();

/** 挂载代号。延迟的 unmount 只在代号仍是最新时才执行，避免销毁后续挂载的 root。 */
let mountGeneration = 0;

export const getContainer = (
  container: Element = document.body,
  config: ContainerConfig = {},
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
  }: { inspector?: InspectorProps; containerConfig?: ContainerConfig } = {},
) => {
  if (!dom?.isConnected || !document) {
    return {
      unmount() {},
    };
  }

  if (typeof ReactDOM.createRoot !== 'function') {
    return {
      unmount() {},
    };
  }

  const container = getContainer(dom, containerConfig) as HTMLElement;
  const generation = ++mountGeneration;

  let root = rootByContainer.get(container);

  if (!root) {
    root = ReactDOM.createRoot(container);
    rootByContainer.set(container, root);
  }

  root.render(<Inspector {...inspector} />);

  return {
    unmount: () => {
      // 同步 unmount 会落在 React 的渲染阶段（StrictMode 下必然发生），
      // React 19 会因此告警并留下竞态。推入微任务，等当前渲染结束再销毁。
      queueMicrotask(() => {
        // 期间若已发生新的挂载，则本次 unmount 作废，不能销毁仍在使用的 root
        if (mountGeneration !== generation) {
          return;
        }

        const current = rootByContainer.get(container);

        if (current) {
          rootByContainer.delete(container);
          current.unmount();
        }
      });
    },
  };
};

export const useInspector = (
  dom: Element,
  config: {
    inspector?: InspectorProps;
    containerConfig?: ContainerConfig;
  } = {},
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
