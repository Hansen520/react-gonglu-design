/*
 * @Date: 2024-02-22 16:49:20
 * @Description: description
 */
import { Dayjs } from 'dayjs';
import Header from './Header';
import './index.less';
import MonthCalendar from './MonthCalendar';

export interface CalendarProps {
  value: Dayjs;
}

const Calendar = (props: CalendarProps) => {
  return (
    <div className="gong-lu-calendar">
      <Header />
      <MonthCalendar {...props} />
    </div>
  );
};

export default Calendar;
