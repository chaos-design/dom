export const CHAOS_DOM_INSPECTOR = 'CHAOS_DOM_INSPECTOR';

export const setChaosDomInspector = (value: string) =>
  `${CHAOS_DOM_INSPECTOR}_${value}`;

export function throttle(func, wait = 100) {
  let timeout;
  let elapsed;
  let lastRunTime = Date.now(); // 上次运行时间

  return function _throttle(...args) {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this, @typescript-eslint/no-this-alias
    const self = this;

    clearTimeout(timeout);

    elapsed = Date.now() - lastRunTime;

    function later() {
      lastRunTime = Date.now();
      timeout = null;
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
