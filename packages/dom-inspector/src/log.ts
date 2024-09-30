const sep = '[@chaos-design/dom-inspector]: ';

const proxy = ['log', 'warn', 'error'];

const consoleInstance: Partial<typeof console> = {};

proxy.forEach((item) => {
  consoleInstance[item] = function funcName(...args) {
    return console[item].call(this, sep, ...args);
  };
});

export default consoleInstance;
