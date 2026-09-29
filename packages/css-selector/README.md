# @chaos-design/css-selector

通过将选择的元素转换为 CSS 选择器，可以快速定位到元素。

## 原理

将选择器的 id、属性、class、nth 等信息通过向上查找层数之后组合出最优的一个选择器信息。

## 使用

### 安装

```sh
# npm yarn
pnpm i @chaos-design/css-selector
```

### 使用

```ts
import getCssSelector, { CssSelector } from '@chaos-design/css-selector';

const element = document.querySelector('#app');

const selector = getCssSelector(element, {
  root: document.body,
  tag: () => true,
});

console.log(selector); // ['#app']

// or

CssSelector.getCssSelector(config, element); // ['#app']

// or

const cssSelector = new CssSelector(config);

cssSelector.getCssSelectorList(element); // ['#app']
```

### 类型定义

```ts
export interface CssSelectorConfig {
  root: Element;
  /**
   * The maximum number of candidates to be returned.
   */
  maxCandidates?: number;
  depth?: number;

  searchMinDepth?: number;
  optimizeMinDepth?: number;

  id?: (name: string, tagName?: string) => boolean;
  class?: (name: string, tagName?: string) => boolean;
  tag?: (tagName?: string) => boolean;
  nth?: (name: string, tagName?: string) => boolean;
  attribute?: (attr: Attr, tagName?: string) => boolean;
}

export const noop = (name: string, tagName: string) => true;

function getCssSelector(
  el: Element | Element[],
  config?: CssSelectorConfig = {
    root: document.body,

    maxCandidates: 10000,
    depth: 1000,

    searchMinDepth: 1,
    optimizeMinDepth: 2,

    timeoutMs: undefined,

    id: noop,
    class: noop,
    tag: (tagName: string) => true,
    nth: noop,
    attribute: (attr, tagName) => false,
  }
): string[];
```
