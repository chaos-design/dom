export const CHAOS_DOM_INSPECTOR = 'CHAOS_DOM_INSPECTOR';

export const setChaosDomInspector = (value: string) =>
  `${CHAOS_DOM_INSPECTOR}_${value}`;

type AnyFn = (...args: any[]) => any;

export function throttle<T extends AnyFn>(func: T, wait = 100) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let lastRunTime = Date.now(); // 上次运行时间

  return function _throttle(this: unknown, ...args: Parameters<T>) {
    const self = this;

    clearTimeout(timeout);

    const elapsed = Date.now() - lastRunTime;

    function later() {
      lastRunTime = Date.now();
      timeout = undefined;
      func.apply(self, args);
    }

    if (elapsed > wait) {
      later();
    } else {
      timeout = setTimeout(later, wait - elapsed);
    }
  };
}

export function isNull(obj) {
  return (
    Object.prototype.toString
      .call(obj)
      .replace(/\[object[\s]/, '')
      .replace(']', '')
      .toLowerCase() === 'null'
  );
}
