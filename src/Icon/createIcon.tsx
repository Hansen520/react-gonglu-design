/*
 * @Date: 2024-02-26 16:34:25
 * @Description: description
 */
import React, { forwardRef } from 'react';
import Icon, { IconProps } from '.';

interface CreateIconOptions {
  content: React.ReactNode;
  iconProps?: IconProps;
  viewBox?: string;
}

function createIcon(options: CreateIconOptions) {
  const { content, iconProps = {}, viewBox = '0 0 1024 1024' } = options;
  /* 这边包了一层传给上一层父组件执行组件，用于操作ref */
  return forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    return (
      <Icon ref={ref} viewBox={viewBox} {...iconProps} {...props}>
        {content}
      </Icon>
    );
  });
}

export { createIcon };
