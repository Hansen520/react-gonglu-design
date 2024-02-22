import { Button } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import styles from './index.module.less';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

interface CalendarRef {
  getDate: () => Date;
  setDate: (date: Date) => void;
}

const InternalCalendar: React.ForwardRefRenderFunction<
  CalendarRef,
  CalendarProps
> = (props, ref) => {
  const { value = new Date(), onChange } = props;

  const [date, setDate] = useState(value);

  useImperativeHandle(ref, () => {
    return {
      getDate() {
        return date;
      },
      // 跳到某个月份后，日期重新for循环渲染
      setDate(date: Date) {
        setDate(date);
      },
    };
  });

  // 上一个月
  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };
  // 下一个月
  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];

  // 此月的总天数
  const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 此月第一号是星期几
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 获取当前月前面剩余几天
  const ExtraDays = (year: number, month: number, i: number) => {
    return new Date(year, month, i).getDate();
  };

  const renderDays = () => {
    const days = [];

    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div className={styles.empty} key={'empty1' + i}>
          {ExtraDays(date.getFullYear(), date.getMonth(), i - firstDay + 1)}
        </div>,
      );
    }

    for (let i = 1; i <= daysCount; i++) {
      const clickHandler = onChange?.bind(
        null,
        new Date(date.getFullYear(), date.getMonth(), i),
      );
      days.push(
        <div
          key={i}
          onClick={clickHandler}
          className={`${styles.day} ${
            i === date.getDate() ? styles.selected : ''
          }`}
        >
          {i}
        </div>,
      );
    }

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div className={styles.empty} key={'empty2' + i}>
          {ExtraDays(date.getFullYear(), date.getMonth(), daysCount + i + 1)}
        </div>,
      );
    }

    return days.slice(0, 42);
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <Button onClick={handlePrevMonth}>&lt;</Button>
        <div>
          {date.getFullYear()} 年 {monthNames[date.getMonth()]}
        </div>
        <Button onClick={handleNextMonth}>&gt;</Button>
      </div>
      <div className={styles.days}>
        <div className={styles.day}>日</div>
        <div className={styles.day}>一</div>
        <div className={styles.day}>二</div>
        <div className={styles.day}>三</div>
        <div className={styles.day}>四</div>
        <div className={styles.day}>五</div>
        <div className={styles.day}>六</div>
        {renderDays()}
      </div>
    </div>
  );
};

const MiniCalendar = React.forwardRef(InternalCalendar);

export default MiniCalendar;
