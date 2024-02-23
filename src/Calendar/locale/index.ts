/*
 * @Date: 2024-02-23 15:32:15
 * @Description: description
 */
import enUS from './en-US';
import { CalendarType } from './interface';
import ruRU from './ru-RU';
import zhCN from './zh-CN';

const allLocales: Record<string, CalendarType> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ru-RU': ruRU, // 俄语
};

export default allLocales;
