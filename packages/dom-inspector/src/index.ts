import { throttle } from './shared';
import { $, addRule, getElementContainerStyle, getZIndex } from './dom';
import { addDynamicStyles } from './style';

export interface DomInspectorOptions {
  dom: HTMLElement;
  container?: {
    theme?: string;
    zIndex?: number;
  };

  onSelect?: (el: HTMLElement) => void;
  onDeselect?: (el: HTMLElement) => void;
  onHover?: (el: HTMLElement) => void;
}

export interface InspectorOptions {
  overlayId: string;
  overlay: Record<string, any>;
}

export enum InspectorStatus {
  'enable' = 1,
  'disable',
  'pause',
}

export default class DomInspector {
  options: DomInspectorOptions;

  container?: DomInspectorOptions['container'];
  root: HTMLElement;
  target: HTMLElement | null;
  cachedTarget: HTMLElement | null;
  status: InspectorStatus;
  inspector: InspectorOptions;

  move: (e: MouseEvent) => void;

  constructor(options: DomInspectorOptions) {
    this.options = options;

    this.root = options.dom || document.body;
    this.container = {
      theme: options.container?.theme || 'dom-inspector-theme-default',
      zIndex: options.container?.zIndex || getZIndex() + 1,
    };
    this.status = InspectorStatus.disable;
    this.target = null;
    this.cachedTarget = null;

    this.inspector = {
      overlayId: '',
      overlay: {},
    };

    this.move = throttle(this.$Move.bind(this), 100);

    this.init();
  }

  init() {
    addDynamicStyles();
    this.inspector.overlayId = 'dom-inspector';

    const parent = this.$createElement('div', {
      id: this.inspector.overlayId,
      class: `dom-inspector ${this.container.theme}`,
      style: `z-index: ${this.container?.zIndex}`,
    });

    this.inspector.overlay = {
      parent,
      content: this.$createOverlayElement(parent, 'content'),
      paddingTop: this.$createOverlayElement(parent, 'padding padding-top'),
      paddingRight: this.$createOverlayElement(parent, 'padding padding-right'),
      paddingBottom: this.$createOverlayElement(
        parent,
        'padding padding-bottom',
      ),
      paddingLeft: this.$createOverlayElement(parent, 'padding padding-left'),
      borderTop: this.$createOverlayElement(parent, 'border border-top'),
      borderRight: this.$createOverlayElement(parent, 'border border-right'),
      borderBottom: this.$createOverlayElement(parent, 'border border-bottom'),
      borderLeft: this.$createOverlayElement(parent, 'border border-left'),
      marginTop: this.$createOverlayElement(parent, 'margin margin-top'),
      marginRight: this.$createOverlayElement(parent, 'margin margin-right'),
      marginBottom: this.$createOverlayElement(parent, 'margin margin-bottom'),
      marginLeft: this.$createOverlayElement(parent, 'margin margin-left'),
      tips: this.$createOverlayElement(
        parent,
        'tips',
        '<div class="tag"></div><div class="id"></div><div class="class"></div><div class="line">&nbsp;|&nbsp;</div><div class="size"></div><div class="triangle"></div>',
      ),
    };

    this.root.appendChild(parent);
  }

  enable() {
    this.status = InspectorStatus.enable;
    this.root.addEventListener('mousemove', this.move);
  }

  disable() {
    this.status = InspectorStatus.disable;
    this.inspector.overlay.parent.style.display = 'none';
    this.inspector.overlay.parent.style.width = 0;
    this.inspector.overlay.parent.style.height = 0;
    this.target = null;

    this.root.removeEventListener('mousemove', this.move);
  }

  pause() {
    this.status = InspectorStatus.pause;

    this.root.removeEventListener('mousemove', this.move);
  }

  destroy() {}

  private $Move(e) {
    this.target = e.target;

    if (this.target === this.cachedTarget) {
      return null;
    }

    this.cachedTarget = this.target;

    const elementStyle = getElementContainerStyle(this.target);
    const contentLevel = {
      width: elementStyle.width,
      height: elementStyle.height,
    };
    const paddingLevel = {
      width:
        elementStyle['padding-left']
        + contentLevel.width
        + elementStyle['padding-right'],
      height:
        elementStyle['padding-top']
        + contentLevel.height
        + elementStyle['padding-bottom'],
    };
    const borderLevel = {
      width:
        elementStyle['border-left-width']
        + paddingLevel.width
        + elementStyle['border-right-width'],
      height:
        elementStyle['border-top-width']
        + paddingLevel.height
        + elementStyle['border-bottom-width'],
    };
    const marginLevel = {
      width:
        elementStyle['margin-left']
        + borderLevel.width
        + elementStyle['margin-right'],
      height:
        elementStyle['margin-top']
        + borderLevel.height
        + elementStyle['margin-bottom'],
    };

    // so crazy
    addRule(this.inspector.overlay.parent, {
      width: `${marginLevel.width}px`,
      height: `${marginLevel.height}px`,
      top: `${elementStyle.top}px`,
      left: `${elementStyle.left}px`,
    });
    addRule(this.inspector.overlay.content, {
      width: `${contentLevel.width}px`,
      height: `${contentLevel.height}px`,
      top: `${
        elementStyle['margin-top']
        + elementStyle['border-top-width']
        + elementStyle['padding-top']
      }px`,
      left: `${
        elementStyle['margin-left']
        + elementStyle['border-left-width']
        + elementStyle['padding-left']
      }px`,
    });
    addRule(this.inspector.overlay.paddingTop, {
      width: `${paddingLevel.width}px`,
      height: `${elementStyle['padding-top']}px`,
      top: `${elementStyle['margin-top'] + elementStyle['border-top-width']}px`,
      left: `${
        elementStyle['margin-left'] + elementStyle['border-left-width']
      }px`,
    });
    addRule(this.inspector.overlay.paddingRight, {
      width: `${elementStyle['padding-right']}px`,
      height: `${paddingLevel.height - elementStyle['padding-top']}px`,
      top: `${
        elementStyle['padding-top']
        + elementStyle['margin-top']
        + elementStyle['border-top-width']
      }px`,
      right: `${
        elementStyle['margin-right'] + elementStyle['border-right-width']
      }px`,
    });
    addRule(this.inspector.overlay.paddingBottom, {
      width: `${paddingLevel.width - elementStyle['padding-right']}px`,
      height: `${elementStyle['padding-bottom']}px`,
      bottom: `${
        elementStyle['margin-bottom'] + elementStyle['border-bottom-width']
      }px`,
      right: `${
        elementStyle['padding-right']
        + elementStyle['margin-right']
        + elementStyle['border-right-width']
      }px`,
    });
    addRule(this.inspector.overlay.paddingLeft, {
      width: `${elementStyle['padding-left']}px`,
      height: `${
        paddingLevel.height
        - elementStyle['padding-top']
        - elementStyle['padding-bottom']
      }px`,
      top: `${
        elementStyle['padding-top']
        + elementStyle['margin-top']
        + elementStyle['border-top-width']
      }px`,
      left: `${
        elementStyle['margin-left'] + elementStyle['border-left-width']
      }px`,
    });
    addRule(this.inspector.overlay.borderTop, {
      width: `${borderLevel.width}px`,
      height: `${elementStyle['border-top-width']}px`,
      top: `${elementStyle['margin-top']}px`,
      left: `${elementStyle['margin-left']}px`,
    });
    addRule(this.inspector.overlay.borderRight, {
      width: `${elementStyle['border-right-width']}px`,
      height: `${borderLevel.height - elementStyle['border-top-width']}px`,
      top: `${elementStyle['margin-top'] + elementStyle['border-top-width']}px`,
      right: `${elementStyle['margin-right']}px`,
    });
    addRule(this.inspector.overlay.borderBottom, {
      width: `${borderLevel.width - elementStyle['border-right-width']}px`,
      height: `${elementStyle['border-bottom-width']}px`,
      bottom: `${elementStyle['margin-bottom']}px`,
      right: `${
        elementStyle['margin-right'] + elementStyle['border-right-width']
      }px`,
    });
    addRule(this.inspector.overlay.borderLeft, {
      width: `${elementStyle['border-left-width']}px`,
      height: `${
        borderLevel.height
        - elementStyle['border-top-width']
        - elementStyle['border-bottom-width']
      }px`,
      top: `${elementStyle['margin-top'] + elementStyle['border-top-width']}px`,
      left: `${elementStyle['margin-left']}px`,
    });
    addRule(this.inspector.overlay.marginTop, {
      width: `${marginLevel.width}px`,
      height: `${elementStyle['margin-top']}px`,
      top: 0,
      left: 0,
    });
    addRule(this.inspector.overlay.marginRight, {
      width: `${elementStyle['margin-right']}px`,
      height: `${marginLevel.height - elementStyle['margin-top']}px`,
      top: `${elementStyle['margin-top']}px`,
      right: 0,
    });
    addRule(this.inspector.overlay.marginBottom, {
      width: `${marginLevel.width - elementStyle['margin-right']}px`,
      height: `${elementStyle['margin-bottom']}px`,
      bottom: 0,
      right: `${elementStyle['margin-right']}px`,
    });
    addRule(this.inspector.overlay.marginLeft, {
      width: `${elementStyle['margin-left']}px`,
      height: `${
        marginLevel.height
        - elementStyle['margin-top']
        - elementStyle['margin-bottom']
      }px`,
      top: `${elementStyle['margin-top']}px`,
      left: 0,
    });

    $('.tag', this.inspector.overlay.tips).innerHTML
      = this.target.tagName.toLowerCase();
    $('.id', this.inspector.overlay.tips).innerHTML = this.target.id
      ? `#${this.target.id}`
      : '';
    $('.class', this.inspector.overlay.tips).innerHTML = [
      ...this.target.classList,
    ]
      .map(item => `.${item}`)
      .join('');
    $(
      '.size',
      this.inspector.overlay.tips,
    ).innerHTML = `${marginLevel.width}x${marginLevel.height}`;

    let tipsTop = 0;
    if (elementStyle.top >= 24 + 8) {
      this.inspector.overlay.tips.classList.remove('reverse');
      tipsTop = elementStyle.top - 24 - 8;
    } else {
      this.inspector.overlay.tips.classList.add('reverse');
      tipsTop = marginLevel.height + elementStyle.top + 8;
    }
    addRule(this.inspector.overlay.tips, {
      top: `${tipsTop}px`,
      left: `${elementStyle.left}px`,
      display: 'block',
    });
  }

  $createOverlayElement(parent, className, content?) {
    const el = this.$createElement(
      'div',
      {
        class: className,
      },
      content,
    );

    parent.appendChild(el);

    return el;
  }

  $createElement(tag, attr, content?) {
    const el = document.createElement(tag);

    Object.keys(attr).forEach((key) => {
      el.setAttribute(key, attr[key]);
    });

    if (content) {
      el.innerHTML = content;
    }

    return el;
  }
}
