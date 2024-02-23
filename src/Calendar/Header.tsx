/*
 * @Date: 2024-02-23 14:08:55
 * @Description: description
 */
import { Dayjs } from 'dayjs';
import { useContext } from 'react';
import allLocales from './locale';
import LocaleContext from './LocaleContext';

interface HeaderProps {
  curMonth: Dayjs;
  prevMonthHandler: () => void;
  nextMonthHandler: () => void;
  todayHandler: () => void;
}

function Header(props: HeaderProps) {
  const localeContext = useContext(LocaleContext);
  const CalendarContext = allLocales[localeContext.locale];

  return (
    <div className="gong-lu-calendar-header">
      <div className="gong-lu-calendar-header-left">
        <div
          className="gong-lu-calendar-header-icon"
          onClick={props.prevMonthHandler}
        >
          &lt;
        </div>
        <div className="gong-lu-calendar-header-value">
          {props.curMonth.format(CalendarContext.formatMonth)}
        </div>
        <div
          className="gong-lu-calendar-header-icon"
          onClick={props.nextMonthHandler}
        >
          &gt;
        </div>
        <div
          className="gong-lu-calendar-header-btn"
          onClick={props.todayHandler}
        >
          {CalendarContext.today}
        </div>
      </div>
    </div>
  );
}

export default Header;
