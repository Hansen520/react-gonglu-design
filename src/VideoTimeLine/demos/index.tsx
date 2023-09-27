/*
 * @Date: 2023-09-26 17:11:39
 * @Description: description
 */
import { useRef, useState, useCallback } from 'react';
import { VideoTimeLine } from 'react-gonglu-design';
import dayjs from 'dayjs';


function Demos() {
  const starttime = useRef<string>('2002-12-20 10:12:00');
  const endtime = useRef<string>('2023-10-01 10:12:00');
  const [playtime, setPlayTime] = useState<string>(dayjs().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss'));
  const handleChange = useCallback((val: any) => {
    setPlayTime(val);
  }, []);

  return (
      <VideoTimeLine
        starttime={starttime.current}
        endtime={endtime.current}
        playtime={playtime}
        onChange={handleChange}
      />
  );
}

export default Demos;
