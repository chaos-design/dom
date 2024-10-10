import appStore, { AppConfigProps, SelectedProps } from './appStore';
export interface AppConfig {
  config: AppConfigProps;
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
