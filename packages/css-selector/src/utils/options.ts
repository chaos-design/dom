export type SelectorType = 'id' | 'className' | 'tag' | 'nth' | 'attribute';

export interface Selector {
  tagName?: string;
  name: string;
  penalty: number;
}

export interface CssSelectorConfig {
  root?: Element;
  /*
   * 优化的最大尝试次数。这是优化和效率之间的权衡。默认值10000在大多数情况下已经足够好了。
   */
  maxCandidates?: number;
  /*
   * 检查使用 nth-child 之前要检查的选择器的最大数量。检查选择器的唯一性是非常昂贵的操作，如果您具有深度为5的DOM树，每个级别有5个类，那么您需要检查超过3k个选择器。默认值1000在大多数情况下已经足够好了。
   */
  depth?: number;

  /*
   * 细分选择器的最小级别长度。从1开始。对于更强大的选择器，请将此参数值设置为4-5，具体取决于您DOM树的深度。如果查找器命中根，则忽略此参数。
   */
  searchMinDepth?: number;
  /*
   * 优化选择器的最小长度为2。例如，选择器body > div > div > p可以优化为body p。
   */
  optimizeMinDepth?: number;

  /**
   * 可选的超时时间（以毫秒为单位）。默认情况下为未定义（无超时）。如果提供了timeoutMs：500，则如果选择器生成需要超过500毫秒，将抛出错误。
   */
  timeoutMs?: number;

  id?: (name: string, tagName?: string) => boolean;
  class?: (name: string, tagName?: string) => boolean;
  tag?: (tagName?: string) => boolean;
  nth?: (name: string, tagName?: string) => boolean;
  attribute?: (attr: Attr, tagName?: string) => boolean;

  transform?: (selector: Selector, SelectorType: SelectorType) => Selector;
}

export const noop = (name: string, tagName: string) => true;

export const defaultOptions: CssSelectorConfig = {
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

  transform: selector => selector,
};

export const sanitizeOptions = (options: CssSelectorConfig) => {
  // sanitize options about type
  return options;
};
