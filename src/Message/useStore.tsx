/*
 * @Date: 2024-04-16 11:26:27
 * @Description: description
 */
import { useState } from 'react';
import { MessageProps, Position } from '.';

type MessageList = {
  top: MessageProps[];
  bottom: MessageProps[];
};

const initialState = {
  top: [],
  bottom: [],
};

let count = 1;
export function getId(messageProps: MessageProps) {
  if (messageProps.id) {
    return messageProps.id;
  }
  count += 1;
  return count;
}

/* 获取消息的位置 */
export function getMessagePosition(messageList: MessageList, id: number) {
  /* position(top, bottom) list = MessageProps[] */
  for (const [position, list] of Object.entries(messageList)) {
    if (list.find((item) => (item.id = id))) {
      return position as Position;
    }
  }
}

/* 寻找信息 */
export function findMessage(messageList: MessageList, id: number) {
  const position = getMessagePosition(messageList, id);

  const index = position
    ? messageList[position].findIndex((item) => item.id === id)
    : -1;

  return {
    position,
    index,
  };
}

function UseStore(defaultPosition: Position) {
  const [messageList, setMessageList] = useState<MessageList>({
    ...initialState,
  });
  return {
    messageList,
    add: (messageProps: MessageProps) => {
      /* 获取计数的id值 */
      const id = getId(messageProps);
      setMessageList((preState) => {
        if (messageProps?.id) {
          const position = getMessagePosition(preState, messageProps.id);
          if (position) return preState;
        }
        const position = messageProps.position || defaultPosition;
        const isTop = position.includes('top');
        // 关键的代码信息,往消息队列上加
        const messages = isTop
          ? // 一个message在前面添加信息，一个是在后面添加信息
            [{ ...messageProps, id }, ...(preState[position] ?? [])]
          : [...(preState[position] ?? []), { ...messageProps, id }];

        return {
          ...preState,
          [position]: messages,
        };
      });
      return id;
    },

    update: (id: number, messageProps: MessageProps) => {
      if (!id) return;

      setMessageList((preState) => {
        const nextState = { ...preState };
        const { position, index } = findMessage(nextState, id);

        if (position && index !== -1) {
          nextState[position][index] = {
            ...nextState[position][index],
            ...messageProps,
          };
        }
        return nextState;
      });
    },

    remove: (id: number) => {
      setMessageList((prevState) => {
        const position = getMessagePosition(prevState, id);

        if (!position) return prevState;
        return {
          ...prevState,
          [position]: prevState[position].filter((notice) => notice.id !== id),
        };
      });
    },

    clearAll: () => {
      setMessageList({ ...initialState });
    },
  };
}

export default UseStore;
