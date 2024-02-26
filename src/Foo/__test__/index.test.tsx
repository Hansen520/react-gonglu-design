/*
 * @Date: 2024-02-23 17:23:53
 * @Description: description
 */
import { render, } from '@testing-library/react';
import Foo from '../index';

test('renders learn react link', () => {
  const { container } = render(<Foo />);
  const linkElement = container.querySelector('.App-link');

  expect(linkElement?.textContent).toMatch(/learn react/i);
});