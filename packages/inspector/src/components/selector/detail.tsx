import { Flex, Segmented } from 'antd';

import { useEmotionCss } from '../shared/emotion';
import { AppProps } from '../../utils/hooks/useApp';

export interface ElementDetailProps extends AppProps {
  className?: string;
}

export default function ElementDetail({}: ElementDetailProps) {
  const css = useEmotionCss();

  return (
    <Flex justify="space-between" align="center" gap={10}>
      <Segmented<string>
        defaultValue=""
        options={['Attributes']}
        onChange={(value) => {
          console.log(value);
        }}
      />
    </Flex>
  );
}
