/*
 * @Date: 2024-04-16 11:22:58
 * @Description: description
 */
import {
  CSSProperties,
  FC,
  forwardRef,
  ReactNode,
  // useImperativeHandle,
  useMemo,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.less';
import useStore from './useStore';
import useTimer from './useTimer';

import { createPortal } from 'react-dom';

export type Position = 'top' | 'bottom';
export interface MessageProps {
  style?: CSSProperties;
  className?: string | string[];
  content: ReactNode;
  duration?: number;
  onClose?: (...args: any) => void;
  id?: number;
  position?: Position;
}

export interface MessageRef {
  add: (messageProps: MessageProps) => number;
  remove: (id: number) => void;
  update: (id: number, messageProps: MessageProps) => void;
  clearAll: () => void;
}

const MessageItem: FC<MessageProps> = (item: any) => {
  const { onMouseEnter, onMouseLeave } = useTimer({
    id: item.id!,
    duration: item.duration,
    remove: item.onClose!,
  });

  return (
    <div
      className="message-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {item.content}-{item.id}
    </div>
  );
};

const MessageProvider = forwardRef<MessageRef>((props, ref) => {
  const { messageList, add, update, remove, clearAll } = useStore('top');

  // useEffect(() => {
  //   setInterval(() => {
  //     add({
  //       content: Math.random().toString().slice(2, 8),
  //     });
  //   }, 2000);
  // }, []);
  if ('current' in ref!) {
    ref.current = {
      add,
      update,
      remove,
      clearAll,
    };
  }
  // useImperativeHandle(
  //   ref,
  //   () => {
  //     debugger;
  //     return {
  //       add,
  //       update,
  //       remove,
  //       clearAll,
  //     };
  //   },
  //   [],
  // );

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
                  timeout={1500}
                  classNames="message"
                >
                  <MessageItem onClose={remove} {...item} />
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
});

export default MessageProvider;
