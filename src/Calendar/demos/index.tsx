/*
 * @Date: 2024-02-22 16:49:20
 * @Description: description
 */
import dayjs from 'dayjs';
import { Calendar } from 'react-gonglu-design';

function Demos() {
  return (
    <Calendar
      value={dayjs('2024-02-22')}
      onChange={(date) => {
        console.log(date.format('YYYY-MM-DD'));
      }}
      // dateInnerContent={(value) => {
      //   return (
      //     <div>
      //       <p style={{ background: 'yellowgreen', height: '30px' }}>
      //         {value.format('YYYY-MM-DD')}
      //       </p>
      //     </div>
      //   );
      // }}
    />
  );
}

export default Demos;
