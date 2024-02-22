import { useEffect, useRef } from 'react';
import { MiniCalendar } from 'react-gonglu-design';

interface CalendarRef {
  getDate: () => Date;
  setDate: (date: Date) => void;
}

function Demos() {
  const calendarRef = useRef<CalendarRef>(null);

  useEffect(() => {
    console.log(calendarRef.current?.getDate().toLocaleDateString());

    setTimeout(() => {
      // calendarRef.current?.setDate(new Date(2024, 3, 18));
    }, 3000);
  }, []);
  return (
    <>
      <MiniCalendar
        ref={calendarRef}
        onChange={(date: Date) => {
          alert(date.toLocaleDateString());
        }}
      />
    </>
  );
}

export default Demos;
