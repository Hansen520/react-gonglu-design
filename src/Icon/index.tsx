/*
 * @Date: 2024-02-26 14:51:12
 * @Description: description
 */
import cs from 'classnames';
import React, { forwardRef, PropsWithChildren } from 'react';
import './index.less';

/* 基础ICON */
type BaseIconProps = {
  className?: string;
  style?: React.CSSProperties;
  size?: string | string[];
  spin?: boolean;
  reverseSpin?: boolean;
};

export type IconProps = BaseIconProps &
  Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const getSize = (size: IconProps['size']) => {
  if (Array.isArray(size) && size.length === 2) {
    return size as string[];
  }
  const width = (size as string) || '1em';
  const height = (size as string) || '1em';

  return [width, height];
};

const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>(
  (props, ref) => {
    const {
      style,
      className,
      spin,
      reverseSpin,
      size = '1em',
      children,
      ...rest
    } = props;

    const [width, height] = getSize(size);

    const cn = cs(
      'icon',
      { 'icon-spin': spin, 'icon-reverse-spin': reverseSpin },
      className,
    );

    return (
      // 利用currentColor能通过 font-size 和 color 来修改 Icon 组件的大小和颜色的原因
      <svg
        ref={ref}
        style={style}
        className={cn}
        width={width}
        height={height}
        fill="currentColor"
        {...rest}
      >
        {children}
      </svg>
    );
  },
);

export default Icon;
