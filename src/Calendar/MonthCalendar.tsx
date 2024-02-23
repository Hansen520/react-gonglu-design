import cs from 'classnames';
import { Dayjs } from 'dayjs';
import { useContext } from 'react';
import { CalendarProps } from '.';
import './index.less';
import allLocales from './locale';
import LocaleContext from './LocaleContext';

// 定义一些属性值
interface MonthCalendarProps extends CalendarProps {
  selectHandler?: (date: Dayjs) => void;
  curMonth: Dayjs;
}

function getAllDays(date: Dayjs) {
  // const daysInMonth = date.daysInMonth(); // 天数
  const startDate = date.startOf('month'); // 此月
  const day = startDate.day(); // 此月开始日

  const daysInfo: Array<{ date: Dayjs; currentMonth: boolean }> = new Array(
    6 * 7,
  );

  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day'),
      currentMonth: false,
    };
  }

  for (let i = day; i < daysInfo.length; i++) {
    const calcDate = startDate.add(i - day, 'day');
    daysInfo[i] = {
      date: calcDate,
      currentMonth: calcDate.month() === date.month(),
    };
  }

  return daysInfo;
}

function renderDays(
  days: Array<{ date: Dayjs; currentMonth: boolean }>,
  dateRender: MonthCalendarProps['dateRender'],
  dateInnerContent: MonthCalendarProps['dateInnerContent'],
  value: Dayjs,
  selectHandler: MonthCalendarProps['selectHandler'],
) {
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) {
      const item = days[i * 7 + j];
      row[j] = (
        <div
          className={
            'gong-lu-calendar-month-body-cell ' +
            (item.currentMonth
              ? 'gong-lu-calendar-month-body-cell-current'
              : '')
          }
          onClick={() => selectHandler?.(item.date)}
        >
          {dateRender ? (
            dateRender(item.date)
          ) : (
            <div className="gong-lu-calendar-month-body-cell-date">
              <div
                className={cs(
                  'gong-lu-calendar-month-cell-body-date-value',
                  value.format('YYYY-MM-DD') === item.date.format('YYYY-MM-DD')
                    ? 'gong-lu-calendar-month-body-cell-date-selected'
                    : '',
                )}
              >
                {item.date.date()}
              </div>
              <div className="gong-lu-calendar-cell-body-date-content">
                {/* 日期下面展示些其他数据, 回调函数的渲染 */}
                {dateInnerContent?.(item.date)}
              </div>
            </div>
          )}
        </div>
      );
    }
    rows.push(row);
  }
  return rows.map((row, index) => (
    <div key={index} className="gong-lu-calendar-month-body-row">
      {row}
    </div>
  ));
}

function MonthCalendar(props: MonthCalendarProps) {
  const localeContext = useContext(LocaleContext);
  const { dateInnerContent, dateRender, value, selectHandler, curMonth } =
    props;

  const CalendarLocale = allLocales[localeContext.locale];
  const weekList = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const allDays = getAllDays(curMonth);

  return (
    <div className="gong-lu-calendar-month">
      <div className="gong-lu-calendar-month-week-list">
        {weekList.map((week) => (
          <div className="gong-lu-calendar-month-week-list-item" key={week}>
            {CalendarLocale.week[week]}
          </div>
        ))}
      </div>
      <div className="gong-lu-calendar-month-body">
        {renderDays(
          allDays,
          dateRender,
          dateInnerContent,
          value,
          selectHandler,
        )}
      </div>
    </div>
  );
}

export default MonthCalendar;
