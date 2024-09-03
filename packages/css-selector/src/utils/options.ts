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

export const defaultOptions: CssSelectorConfig = {
  root: document.body,

  maxCandidates: 10000,
  depth: 1000,

  searchMinDepth: 1,
  optimizeMinDepth: 2,

  id: noop,
  class: noop,
  tag: (tagName: string) => true,
  nth: noop,
  attribute: (attr, tagName) => false,
};

export const sanitizeOptions = (options: CssSelectorConfig) => {
  // sanitize options about type
  return options;
};
