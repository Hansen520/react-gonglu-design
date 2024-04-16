/*
 * @Date: 2024-04-16 11:22:58
 * @Description: description
 */
import { CSSProperties, ReactNode, useEffect, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.scss';
import useStore from './useStore';

import { createPortal } from 'react-dom';

export type Position = 'top' | 'bottom';

export interface MessageProps {
  style?: CSSProperties;
  className?: string | string[];
  content: ReactNode;
  duration?: number;
  id?: number;
  position?: Position;
}

const MessageProvider = () => {
  const { messageList, add } = useStore('top');

  useEffect(() => {
    setInterval(() => {
      add({
        content: Math.random().toString().slice(2, 8),
      });
    }, 2000);
  }, []);

  const positions = Object.keys(messageList) as Position[];

  const messageWrapper = (
    <div className="message-wrapper">
      {positions.map((direction) => {
        return (
          <TransitionGroup
            className={`message-wrapper-${direction}`}
            key={direction}
          >
            {messageList[direction].map((item) => {
              return (
                <CSSTransition
                  key={item.id}
                  timeout={1000}
                  classNames="message"
                >
                  <div className="message-item">
                    {item.content}-{item.id}
                  </div>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        );
      })}
    </div>
  );

  const el = useMemo(() => {
    const el = document.createElement('div');
    el.className = `wrapper`;

    document.body.appendChild(el);
    return el;
  }, []);

  return createPortal(messageWrapper, el);
};

export default MessageProvider;
