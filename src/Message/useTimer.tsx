/*
 * @Date: 2024-04-17 10:41:40
 * @Description: description
 */
import { useEffect, useRef } from 'react';

export interface UseTimerProps {
  id: number;
  duration?: number;
  remove: (id: number) => void;
}

function useTimer(props: UseTimerProps) {
  const { remove, id, duration = 2000 } = props;

  const timer = useRef<number | null>(null);

  const removeTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const startTimer = () => {
    timer.current = window.setTimeout(() => {
      remove(id); // 定时器结束后，调用remove函数移除该定时器
      removeTimer();
    }, duration); // duration时间走一个
  };

  useEffect(() => {
    startTimer();
    return () => {
      removeTimer();
    };
  }, []);

  const onMouseEnter = () => {
    removeTimer();
  };

  const onMouseLeave = () => {
    startTimer();
  };

  return {
    onMouseEnter,
    onMouseLeave,
  };
}

export default useTimer;
