/*
 * @Date: 2024-02-22 16:49:20
 * @Description: description
 */
/*
 * @Date: 2024-02-22 16:49:20
 * @Description: description
 */
import dayjs, { Dayjs } from 'dayjs';
import { CSSProperties, ReactNode, useState } from 'react';
import Header from './Header';
import './index.less';
import LocaleContext from './LocaleContext';
import MonthCalendar from './MonthCalendar';

export interface CalendarProps {
  value: Dayjs;
  style?: CSSProperties;
  className?: string | string[];
  // 定制日期显示，会完全覆盖日期单元格
  dateRender?: (currentDate: Dayjs) => ReactNode;
  // 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
  dateInnerContent?: (currentDate: Dayjs) => ReactNode;
  // 国际化相关
  locale?: string;
  onChange?: (date: Dayjs) => void;
}

const Calendar = (props: CalendarProps) => {
  const [curValue, setCurValue] = useState<Dayjs>(props.value);

  const [curMonth, setCurMonth] = useState<Dayjs>(props.value);

  const changeDate = (date: Dayjs) => {
    setCurValue(date);
    setCurMonth(date);
    props.onChange?.(date);
  };

  const selectHandler = (date: Dayjs) => {
    changeDate(date);
  };

  const prevMonthHandler = () => {
    setCurMonth(curMonth.subtract(1, 'month'));
  };

  const nextMonthHandler = () => {
    setCurMonth(curMonth.add(1, 'month'));
  };

  const todayHandler = () => {
    const date = dayjs(Date.now());
    changeDate(date);
  };

  return (
    <LocaleContext.Provider
      value={{
        // 传入国际化的值
        locale: props.locale || navigator.language,
      }}
    >
      <div className="gong-lu-calendar">
        <Header
          curMonth={curMonth}
          todayHandler={todayHandler}
          prevMonthHandler={prevMonthHandler}
          nextMonthHandler={nextMonthHandler}
        />
        <MonthCalendar
          {...props}
          curMonth={curMonth}
          value={curValue}
          selectHandler={selectHandler}
        />
      </div>
    </LocaleContext.Provider>
  );
};

export default Calendar;
