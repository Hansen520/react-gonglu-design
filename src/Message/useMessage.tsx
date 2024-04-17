/*
 * @Date: 2024-04-17 14:18:42
 * @Description: description
 */
import { useContext } from 'react';
import { MessageRef } from '.';
import { ConfigContext } from './configProvider';

export function UseMessage(): MessageRef {
  const { messageRef } = useContext(ConfigContext);

  if (!messageRef) {
    throw new Error('请在最外层添加 ConfigProvider 组件');
  }
  return messageRef.current!;
}

export default UseMessage;
