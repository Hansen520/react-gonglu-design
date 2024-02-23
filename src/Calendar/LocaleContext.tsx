/*
 * @Date: 2024-02-23 15:25:49
 * @Description: description
 */
import { createContext } from 'react';

export interface LocaleContextType {
  locale: string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en-US', // 和这个值无关, 就是建立一个上下文本
});

export default LocaleContext;
