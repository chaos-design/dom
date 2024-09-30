import { createContext, useContext, useEffect, useState } from 'react';
import { ElementRect, generateElementSelector } from '../dom/selector';
import FindElement from '../selector/find';
export interface AppConfig {
  container?: Document;
  selectorType: string;
  dragging: boolean;
  disabled: boolean;
  single: boolean;
}

export interface AppContextProps {
  container: Document;
  config: AppConfig;
  setAppValue: (value: Partial<AppConfig>) => void;
}

export const AppContext = createContext<AppContextProps>({
  config: {
    selectorType: 'css',
    dragging: false,
    disabled: false,
    single: true,
  },
} as AppContextProps);

export const useAppContext = () => useContext(AppContext);

export interface SelectedProps extends Record<string, any> {
  selector: string;
  selectedElement: Element | null;
  selectedElements: ElementRect[];
  elements: ElementRect[];
  path?: Element[];
}

export interface AppProps {
  config: AppConfig;
  selected: SelectedProps;
}

export const useApp = () => {
  const [selected, setSelected] = useState<SelectedProps>({
    selector: '',
    selectedElement: null,
    selectedElements: [],
    elements: [],
  });

  const [container, setContainer] = useState<Document | null>(null);
  const [config, setConfig] = useState<AppConfig>({
    container: document,
    selectorType: 'css',
    dragging: false,
    disabled: false,
    single: true,
  });

  const setAppValue = (
    value: Partial<AppConfig> | Partial<SelectedProps>,
    type?: 'selector' | 'config'
  ) => {
    if (type === 'selector') {
      setSelected((s) => ({
        ...s,
        ...value,
      }));
    } else {
      setConfig((c) => ({
        ...c,
        ...value,
      }));
    }
  };

  const findElement = () => {
    if (selected.selectedElement) {
      return selected.selectedElement;
    }

    if (config.selectorType === 'css') {
      return FindElement.cssSelector(
        {
          selector: selected.selector,
          multiple: false,
        },
        config.container
      );
    } else {
      return FindElement.xpath(
        {
          selector: selected.selector,
          multiple: false,
        },
        config.container
      );
    }
  };

  useEffect(() => {
    if (selected.selector) {
      const target = findElement() as Element;

      setSelected((s) => ({
        ...s,
        selector: generateElementSelector({
          selectorType: config.selectorType,
          target,
        }),
      }));
    }
  }, [config.selectorType, selected.selector]);

  return {
    selected,
    setSelected,

    config,
    setAppValue,

    container,
    setContainer,
  };
};
