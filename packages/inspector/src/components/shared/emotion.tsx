import createEmotion, { Emotion } from '@emotion/css/create-instance';

import { createContext, useContext, useMemo } from 'react';

const EmotionCssContext = createContext<ReturnType<
  typeof createEmotion
> | null>(null);

export const EmotionCssProvider: React.FC<{
  children: React.ReactNode;
  container: HTMLElement;
}> = ({ children, container }) => {
  const emotion = useMemo(
    () =>
      createEmotion({
        key: 'chaos-inspector',
        container,
      }),
    [container]
  );

  return (
    <EmotionCssContext.Provider value={emotion}>
      {children}
    </EmotionCssContext.Provider>
  );
};

export const useEmotion = (): Emotion => {
  const emotion = useContext(EmotionCssContext);

  return emotion as Emotion;
};

export const useEmotionCss = (): Emotion['css'] => {
  const emotion = useEmotion();

  return emotion?.css;
};
