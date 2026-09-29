import { Button, Tooltip } from 'antd';
import React from 'react';

export interface TipButtonProps extends React.ComponentProps<typeof Button> {
  children?: React.ReactNode;
  tooltipProps?: React.ComponentProps<typeof Tooltip>;
}

const TipButton: React.FC<TipButtonProps> = ({
  children,
  tooltipProps,
  ...props
}) => {
  if (!tooltipProps) {
    return <Button {...props}>{children}</Button>;
  }

  return (
    <Tooltip
      placement="top"
      {...tooltipProps}
      getPopupContainer={(node) => node.parentNode as HTMLElement}
    >
      <Button {...props}>{children}</Button>
    </Tooltip>
  );
};

export default TipButton;
