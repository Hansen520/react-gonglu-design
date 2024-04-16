/*
 * @Date: 2024-04-16 11:22:58
 * @Description: description
 */
import { CSSProperties, ReactNode } from 'react';

export type Position = 'top' | 'bottom';

export interface MessageProps {
  style?: CSSProperties;
  className?: string | string[];
  content: ReactNode;
  duration?: number;
  id?: number;
  position?: Position;
}

export const MessageProvider = () => {
  return <div></div>;
};
