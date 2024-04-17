/*
 * @Date: 2024-04-17 11:31:48
 * @Description: description
 */
import { createContext, PropsWithChildren, RefObject, useRef } from 'react';
import MessageProvider, { MessageRef } from '.';

interface ConfigProviderProps {
  messageRef?: RefObject<MessageRef>;
}

export const ConfigContext = createContext<ConfigProviderProps>({});

function ConfigProvider(props: PropsWithChildren) {
  const { children } = props;
  const messageRef = useRef<MessageRef>(null);
  return (
    <ConfigContext.Provider value={{ messageRef }}>
      <MessageProvider ref={messageRef}></MessageProvider>
      {children}
    </ConfigContext.Provider>
  );
}

export default ConfigProvider;
