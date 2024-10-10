import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ElementRect, generateElementSelector } from '../dom/selector';
import FindElement from '../selector/find';
import {
  ARIA_ATTRS,
  CssSelectorSetting,
  getCssSelectorConfig,
} from '../selector/css';
import appStore from './appStore';

export interface AppConfig {
  container?: Document;
  selectorType: string;
  dragging: boolean;
  disabled: boolean;
  single: boolean;
  setting: boolean;

  settings?: CssSelectorSetting;
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
  selectElements: ElementRect[];
  selectedElements: ElementRect[];
  elements: ElementRect[];
  path?: Element[];
}

export interface AppProps {
  config: AppConfig;
  selected: SelectedProps;
}

export const useApp = () => {
  return {
    store: appStore,
    selected: appStore.selected,

    config: appStore.config,
    setAppValue: appStore.setAppValue,

    container: appStore.container,
    setContainer: appStore.setContainer,
  };
};
