/*
 * @Date: 2023-09-26 11:29:34
 * @Description: description
 */
import React, { memo } from 'react';
import './index.less' // 引入样式
export interface ButtonProps {
  /** 按钮类型 */
  type?: 'primary' | 'default';
  /** 按钮文字 */
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { type = 'default', children, onClick } = props;
  return (
    <button
      type="button"
      className={`dumi-btn ${type ? 'dumi-btn-' + type : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default memo(Button);
