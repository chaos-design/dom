function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export function uuid(): string {
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): T {
  let timer: ReturnType<typeof setTimeout> | null = null;

  // @ts-expect-error
  return function (...rest: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // @ts-expect-error
      func.apply(this, rest);
    }, delay) as any;
  };
}

interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}
/* options的默认值
 *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
 *  options.leading = true;
 *  表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
 *  options.trailing = true;
 * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
 */
export function throttle(
  func: (p: any) => any,
  wait: number,
  options: ThrottleOptions,
): () => any {
  let context: any;
  let args: any;
  let result: any;
  let timeout = 0;
  let previous = 0;
  if (!options) options = {};
  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = 0;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };
  return function (...rest: any) {
    const now = Date.now();
    if (!previous && options.leading === false) {
      previous = now;
    }

    // 计算剩余时间
    const remaining = wait - (now - previous);

    // @ts-expect-error
    context = this;
    args = rest;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = 0;
      }

      previous = now;
      result = func.apply(context, args);

      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      // options.trailing=true时，延时执行func函数
      timeout = setTimeout(later, remaining) as any;
    }
    return result;
  };
}
