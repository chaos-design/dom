declare const unique_id: unique symbol;

export type ObjectValues<T> = T[keyof T];

export const CSS_SELECTOR_TYPE = {
  id: 'id',
  class: 'class',
  tag: 'tag',
  attribute: 'attribute',
  nthchild: 'nthchild',
  nthoftype: 'nthoftype',
} as const;

export type CssSelectorType = ObjectValues<typeof CSS_SELECTOR_TYPE>;
export type CssSelectorTypes = CssSelectorType[];

export interface TypeKey<T> {
  readonly [unique_id]: T;
}

export type CSSSelector = string;
