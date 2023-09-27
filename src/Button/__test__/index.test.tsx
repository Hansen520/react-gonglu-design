/*
 * @Date: 2023-09-26 15:30:18
 * @Description: description
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from '../index';

describe('Button组件', () => {
  it('能够正确的渲染按钮文字', () => {
    const buttonText = '按钮文字';
    const { getByRole } = render(<Button>{buttonText}</Button>);
    const buttonElement = getByRole('button');
    expect(buttonElement.innerHTML).toBe(buttonText);
  });

  it('能够正确渲染默认样式的按钮', () => {
    const { getByRole } = render(<Button>默认按钮</Button>);
    const buttonElement = getByRole('button');
    expect(buttonElement.classList.contains('dumi-btn')).toBe(true);
  })

  it('能够正确渲染主要样式的按钮', () => {
    const { getByRole } = render(<Button type="primary">主要按钮</Button>);
    const buttonElement = getByRole('button');
    expect(buttonElement.classList.contains('dumi-btn-primary')).toBe(true);
  });

  it('能够触发点击事件', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button type="primary" onClick={handleClick}>点击按钮</Button>);
    const buttonElement = getByRole('button');
    fireEvent.click(buttonElement);
    // 断言函数被调用了一次
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

