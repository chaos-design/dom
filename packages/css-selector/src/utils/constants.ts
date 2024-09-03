import { CSS_SELECTOR_TYPE } from '../types';

export const SELECTOR_PATTERN = [
  CSS_SELECTOR_TYPE.id,
  CSS_SELECTOR_TYPE.tag,
  CSS_SELECTOR_TYPE.class,
  CSS_SELECTOR_TYPE.attribute,
  CSS_SELECTOR_TYPE.nthchild,
  CSS_SELECTOR_TYPE.nthoftype,
];

// RegExp that will match invalid patterns that can be used in ID attribute.
export const INVALID_ID_REGEXP = new RegExp(
  [
    '^$', // empty or not set
    '\\s', // contains whitespace
  ].join('|'),
);

// RegExp that will match invalid patterns that can be used in class attribute.
export const INVALID_CLASS_REGEXP = new RegExp(
  [
    '^$', // empty or not set
  ].join('|'),
);
