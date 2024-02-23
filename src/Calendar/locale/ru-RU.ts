/*
 * @Date: 2024-02-23 15:13:29
 * @Description: description
 */
import { CalendarType } from './interface';

const CalendarLocale: CalendarType = {
  formatYear: 'YYYY год',
  formatMonth: 'YYYY год MM месяц',
  today: 'Сегодня',
  month: {
    January: 'Январь',
    February: 'Февраль',
    March: 'Март',
    April: 'Апрель',
    May: 'Май',
    June: 'Июнь',
    July: 'Июль',
    August: 'Август',
    September: 'Сентябрь',
    October: 'Октябрь',
    November: 'Ноябрь',
    December: 'Декабрь',
  },
  week: {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',
  },
};

export default CalendarLocale;
