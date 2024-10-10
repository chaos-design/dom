import { makeAutoObservable } from 'mobx';
import { ARIA_ATTRS, CssSelectorSetting } from '../selector/css';
import { ElementRect } from '../dom/selector';

export interface AppConfigProps {
  container?: Document;
  selectorType: string;
  dragging: boolean;
  disabled: boolean;
  single: boolean;
  setting: boolean;

  settings?: CssSelectorSetting;
}

export interface SelectedProps extends Record<string, any> {
  selector: string;
  selectedElement: Element | null;
  selectElements: ElementRect[];
  selectedElements: ElementRect[];
  elements: ElementRect[];
  path?: Element[];
}

class AppStore {
  config: AppConfigProps = {
    container: document,
    selectorType: 'css',
    dragging: false,
    disabled: false,
    single: true,
    setting: false,
    settings: {
      idName: true,
      tagName: true,
      className: true,
      attributes: ARIA_ATTRS.join(','),
    },
  };

  selected: SelectedProps = {
    selector: '',
    selectedElement: null,
    selectElements: [],
    selectedElements: [],
    elements: [],
  };

  setAppValue;

  constructor() {
    makeAutoObservable(this);

    this.setAppValue = (
      value: Partial<AppConfigProps> | Partial<SelectedProps>,
      type: 'selector' | 'config' = 'config'
    ) => {
      if (type === 'selector') {
        this.setSelected(value);
      } else if (type === 'config') {
        this.setConfig(value as Partial<AppConfigProps>);
      }
    };
  }

  get container() {
    return this.config.container;
  }

  get selectorType() {
    return this.config.selectorType;
  }
  get dragging() {
    return this.config.dragging;
  }

  get disabled() {
    return this.config.disabled;
  }

  get single() {
    return this.config.single;
  }

  get setting() {
    return this.config.setting;
  }

  get settings() {
    return this.config.settings;
  }
  get selector() {
    return this.selected.selector;
  }

  setContainer(container: Document) {
    this.config.container = container;
  }

  setConfig(config: Partial<AppConfigProps>) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  setSelected(selected: Partial<SelectedProps>) {
    this.selected = {
      ...this.selected,
      ...selected,
    };
  }
}

const appStore = new AppStore();

export default appStore;
