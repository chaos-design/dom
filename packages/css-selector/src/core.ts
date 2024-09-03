import {
  getElementAttribute,
  getElementClassList,
  getElementId,
} from '@chaos-design/dom-finder';
import { isNotEmpty } from './utils/element';
import {
  type CssSelectorConfig,
  defaultOptions,
  sanitizeOptions,
} from './utils/options';
import { sanitizeElements } from './utils/selector';

export interface CssSelectorPathNode {
  tagName?: string;
  name: string;
  penalty: number;
  level?: number;
}

export interface OptimizeScope {
  counter: number;
  visited: Map<string, boolean>;
}

export type CssSelectorPath = CssSelectorPathNode[];

/**
 * mind
 * dom
 *  => [
 *        [(current)id attr class tagName, nth],
 *        [(parent)id attr class tagName, nth],
 *        ...
 *     ]
 *  => combination
 *  => sort penalty
 *  => optimize
 *  => low penalty score
 *  => unique path
 *  => combination selector
 */
class CssSelector {
  elements: Element[];
  rootDocument: Element | Document;
  config: CssSelectorConfig;

  constructor(el: Element | Element[], config?: CssSelectorConfig) {
    this.elements = sanitizeElements(el);

    this.config = sanitizeOptions(Object.assign(defaultOptions, config));
    this.rootDocument = this.findRootDocument(this.config.root);
  }

  findRootDocument(rootNode: Element | Document) {
    if (rootNode.nodeType === Node.DOCUMENT_NODE) {
      return rootNode;
    }

    if (rootNode.isEqualNode(defaultOptions.root)) {
      return rootNode.ownerDocument;
    }

    return rootNode;
  }

  getCssSelectorList(): (undefined | string)[] {
    const { elements } = this;

    return elements.map((el: Element) => this.getCssSelector(el));
  }

  getCssSelector(el: Element): string | undefined {
    if (el.tagName.toLowerCase() === 'html') {
      return 'html';
    }

    const { config } = this;

    this.findRootDocument(config.root);

    const elPath = this.searchElementPath(el, 'all', () =>
      this.searchElementPath(el, 'two', () =>
        this.searchElementPath(el, 'one', () =>
          this.searchElementPath(el, 'none'),
        ),
      ),
    );

    if (elPath) {
      let path = elPath;
      const optimized = this.sort(this.optimize(elPath, el));

      if (optimized.length > 0) {
        path = optimized[0];
      }

      return this.combinationSelector(path);
    } else {
      return undefined;
      // throw new Error(
      //   `The element of ${el} was not be searched a selector in ${config.root}`,
      // );
    }
  }

  dispensableNth(node: CssSelectorPathNode) {
    return node.name !== 'html' && !node.name.startsWith('#');
  }

  sanitizeNode(
    ...level: (CssSelectorPathNode | null)[]
  ): CssSelectorPathNode[] | null {
    const list = level.filter(isNotEmpty);

    if (list.length) {
      return list;
    }

    return null;
  }

  searchElementPath(
    el: Element,
    limit: 'all' | 'two' | 'one' | 'none',
    fallback?: () => CssSelectorPath | null,
  ) {
    let path: CssSelectorPath | null = null;
    const pathStack: CssSelectorPath[] | null = [];

    let current: Element | null = el;

    let i = 0;

    const nth = this.findNthIndex(current);

    while (current) {
      let level: CssSelectorPath | null = this.sanitizeNode(this.id(current))
        || this.sanitizeNode(...this.attribute(current))
        || this.sanitizeNode(...this.className(current))
        || this.sanitizeNode(this.tagName(current)) || [this.any()];

      if (limit === 'all') {
        if (nth) {
          level = level.concat(
            level
              .filter(this.dispensableNth)
              .map(node => this.sanitizeNthChild(node, nth)),
          );
        }
      } else if (limit === 'two') {
        level = level.slice(0, 1);

        if (nth) {
          level = level.concat(
            level
              .filter(this.dispensableNth)
              .map(node => this.sanitizeNthChild(node, nth)),
          );
        }
      } else if (limit === 'one') {
        const [node] = (level = level.slice(0, 1));

        if (nth && this.dispensableNth(node)) {
          level = [this.sanitizeNthChild(node, nth)];
        }
      } else if (limit === 'none') {
        level = [this.any()];

        if (nth) {
          level = [this.sanitizeNthChild(level[0], nth)];
        }
      }

      for (const node of level) {
        node.level = i;
      }

      pathStack.push(level);

      if (pathStack.length >= this.config.searchMinDepth) {
        path = this.findUniquePath(pathStack, fallback);

        if (path) {
          break;
        }
      }

      current = current.parentElement;
      i++;
    }

    if (!path) {
      path = this.findUniquePath(pathStack, fallback);
    }

    if (!path && fallback) {
      return fallback();
    }

    return path;
  }

  *combinations(
    stack: CssSelectorPath[],
    path: CssSelectorPath = [],
  ): Generator<CssSelectorPath> {
    if (stack.length > 0) {
      for (const node of stack[0]) {
        yield * this.combinations(
          stack.slice(1, stack.length),
          path.concat(node),
        );
      }
    } else {
      yield path;
    }
  }

  *optimize(
    path: CssSelectorPath,
    el: Element,
    scope: OptimizeScope = {
      counter: 0,
      visited: new Map<string, boolean>(),
    },
  ): Generator<CssSelectorPath> {
    // [inputEl, ...parentEl]
    if (path.length > 2 && path.length > this.config.optimizeMinDepth) {
      for (let i = 1; i < path.length - 1; i++) {
        if (scope.counter > this.config.maxCandidates) {
          return;
        }

        scope.counter += 1;
        const newPath = [...path];

        newPath.slice(i, 1);
        const pathSelector = this.combinationSelector(newPath);

        if (scope.visited.has(pathSelector)) {
          return;
        }

        if (
          this.isUniquePath(pathSelector)
          && this.isSameElement(pathSelector, el)
        ) {
          yield newPath;

          scope.visited.set(pathSelector, true);

          yield * this.optimize(newPath, el, scope);
        }
      }
    }
  }

  combinationSelector(path: CssSelectorPath): string {
    let current = path[0];
    let query = current.name;

    for (let i = 1; i < path.length; i++) {
      const next = path[i];
      const level = next.level || 0;

      if (current.level === level - 1) {
        query = ` ${next.name} > ${query}`;
      } else {
        query = ` ${next.name} ${query}`;
      }

      current = next;
    }
    return query;
  }

  findUniquePath(
    stack: CssSelectorPath[],
    fallback?: () => CssSelectorPath | null,
  ): CssSelectorPath | null {
    const paths = this.sort(this.combinations(stack));

    if (paths.length > this.config.depth) {
      return fallback ? fallback() : null;
    }

    for (const candidate of paths) {
      if (this.isUniquePath(candidate)) {
        return candidate;
      }
    }

    return null;
  }

  isUniquePath(path: string | CssSelectorPath): boolean {
    if (typeof path !== 'string') {
      path = this.combinationSelector(path);
    }

    switch (this.rootDocument.querySelectorAll(path).length) {
      case 1:
        return true;
      case 0:
        return false;
      default:
        return false;
    }
  }

  findNthIndex(el: Element) {
    const parent = el.parentNode;

    if (!parent) {
      return null;
    }

    let child = parent.firstChild;

    if (!child) {
      return null;
    }

    let i = 0;

    while (child) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        i++;
      }

      if (child.isEqualNode(el)) {
        break;
      }

      child = child.nextSibling;
    }

    return i;
  }

  id(el: Element) {
    const id = getElementId(el);

    if (id && this.config.id(id, el.tagName.toLowerCase())) {
      return {
        tagName: el.tagName.toLowerCase(),
        name: `${id}`,
        penalty: 0,
      };
    }

    return null;
  }

  attribute(el) {
    const attrList = getElementAttribute(el)
      .filter((attr: Attr) =>
        this.config.attribute(attr, el.tagName.toLowerCase()),
      )
      .map(({ name, value }: Attr) => {
        return `[${name}='${value}']`;
      });

    return attrList.map(attr => ({
      tagName: el.tagName.toLowerCase(),
      name: `${attr}`,
      penalty: 0.5,
    }));
  }

  className(el) {
    const classList = getElementClassList(el).filter((name: string) =>
      this.config.class(name, el.tagName.toLowerCase()),
    );

    return classList.map(name => ({
      tagName: el.tagName.toLowerCase(),
      name: `.${CSS.escape(name)}`,
      penalty: 1,
    }));
  }

  tagName(el: Element) {
    const tagName = el.tagName.toLowerCase();

    if (this.config.tag(tagName)) {
      return {
        tagName,
        name: tagName,
        penalty: 2,
      };
    }
  }

  any() {
    return {
      name: '*',
      penalty: 3,
    };
  }

  sanitizeNthChild(
    node: CssSelectorPathNode,
    nth: number,
  ): CssSelectorPathNode {
    return {
      tagName: node?.tagName ? node.tagName.toLowerCase() : '',
      name: `${node.name}:nth-child(${nth})`,
      penalty: node.penalty + 1,
    };
  }

  sort(paths: Iterable<CssSelectorPath>): CssSelectorPath[] {
    return [...paths].sort((a, b) => this.penalty(a) - this.penalty(b));
  }

  penalty(path: CssSelectorPath): number {
    return path
      .map((node: CssSelectorPathNode) => node.penalty)
      .reduce((a, b) => a + b, 0);
  }

  isSameElement(path: string, el: Element) {
    return this.rootDocument.querySelector(path) === el;
  }
}

export default CssSelector;
