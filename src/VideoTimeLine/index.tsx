import { useEffect, useRef } from 'react';
import styles from './index.module.less';
import dayjs from 'dayjs';

interface Props {
  starttime?: string;
  endtime?: string;
  playtime: string;
  onChange: (val: string) => void;
}

const toNum = (val: number) => (val > 9 ? `${val}` : `0${val}`);

const TimeLine = ({ starttime, endtime, playtime, onChange }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const move = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cvs = ref.current!;
    const unit = 60;
    const clientRect = (cvs.parentNode! as HTMLDivElement).getBoundingClientRect();
    let startX;
    let startFormatTime: any;
    const width = clientRect.width - 2;
    const height = clientRect.height - 2;
    cvs.width = width;
    cvs.height = height;
    const ctx = cvs.getContext('2d')!;
    let inum = 0;
    let step = 0;
    let startNum = 0;
    const renderText = (text: string, x: number) => {
      ctx.fillStyle = '#656566';
      ctx.font = '13px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(text, x, 15);
    };
    const renderLine = (x: number, _step: number) => {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#979899';
      ctx.beginPath();
      ctx.moveTo(x - 0.5, 0);
      ctx.lineTo(x - 0.5, _step % 4 === 1 ? 10 : 6);
      ctx.stroke();
      if (_step % 4 === 1) {
        const house = dayjs(startFormatTime)
          .add(x * unit, 'seconds')
          .format('HH:00');
        if (house === '00:00') {
          renderText(
            dayjs(startFormatTime)
              .add(x * unit, 'seconds')
              .format('YYYY-MM-DD'),
            x,
          );
        } else {
          renderText(house, x);
        }
      }
    };
    const renderActive = (time?: string) => {
      const middle = width / 2;
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#3370FF';
      ctx.moveTo(middle, 0);
      ctx.lineTo(middle, 42);
      ctx.stroke();
      ctx.fillStyle = '#3370FF';
      ctx.font = '13px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(time || playtime, middle, 45);
    };
    const renderMouseActive = (mouseX: number) => {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#3370FF';
      ctx.moveTo(mouseX, 0);
      ctx.lineTo(mouseX, 42);
      ctx.stroke();
      ctx.fillStyle = '#3370FF';
      ctx.font = '13px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(
        dayjs(startFormatTime)
          .add(mouseX * unit, 'seconds')
          .format('YYYY-MM-DD HH:mm:ss'),
        mouseX,
        45,
      );
    };
    const render = (mouseX?: number, currentTime?: string) => {
      inum = 0;
      step = 0;
      startNum = 0;
      startX = dayjs(currentTime || playtime).subtract((width * unit) / 2, 'seconds');
      startFormatTime = startX.format('YYYY-MM-DD HH:mm:ss');
      const startHouse = parseInt(startX.format('HH'), 10);
      const startIndexHouse = toNum(startHouse % 2 === 0 ? startHouse + 2 : startHouse + 1);
      ctx.clearRect(0, 0, width, height);
      while (inum < width) {
        inum += 1;
        if (
          step === 0 &&
          dayjs(startFormatTime)
            .add(inum * unit, 'seconds')
            .format('HH:mm') === `${startIndexHouse === '24' ? '00' : startIndexHouse}:00`
        ) {
          step += 1;
          startNum = inum;
          if (startNum > 30) {
            // eslint-disable-next-line no-loop-func
            new Array(Math.ceil(startNum / 30)).fill(1).map((item, index) => {
              renderLine(startNum - index * 30, index === 0 ? step : 0);
              return item;
            });
          } else {
            renderLine(inum, 1);
          }
          inum += 29;
        } else if (step > 0 && (inum - startNum) % 30 === 0) {
          step += 1;
          renderLine(inum, step);
          inum += 29;
        }
      }
      renderActive(currentTime);
      if (mouseX && mouseX > 0) {
        renderMouseActive(mouseX);
      }
    };
    render(0);
    const handleAction = (e: any, type: string) => {
      let currTime;
      switch (type) {
        case 'mousemove':
          render(e.offsetX);
          break;
        case 'mouseenter':
          render(0);
          break;
        case 'mouseleave':
          render(0);
          break;
        case 'click':
          currTime = dayjs(startFormatTime)
            .add(e.offsetX * unit, 'seconds')
            .format('YYYY-MM-DD HH:mm:ss');
          onChange && typeof onChange === 'function' && onChange(currTime);
          break;
        default:
          break;
      }
    };
    function handleClick(e: any) {
      handleAction(e, 'click');
    }
    function handleMouseenter(e: any) {
      handleAction(e, 'mouseenter');
    }
    function handleMouseleave(e: any) {
      handleAction(e, 'mouseleave');
    }
    function handleMousemove(e: any) {
      handleAction(e, 'mousemove');
    }
    let hanMove = false;
    let currTime: string | null = null;
    const onMouseDown = (e: any) => {
      const distX = e.clientX;
      currTime = null;
      hanMove = true;
      const onMouseMove = (ev: any) => {
        if (hanMove) {
          const diff = ev.clientX - distX;
          currTime = dayjs(playtime)
            .subtract(diff * unit, 'seconds')
            .format('YYYY-MM-DD HH:mm:ss');
          render(0, currTime);
        }
      };
      const onMouseUp = () => {
        if (hanMove && currTime !== null) {
          onChange && typeof onChange === 'function' && onChange(currTime);
        }
        hanMove = false;
        document.body.removeEventListener('mousemove', onMouseMove);
        document.body.removeEventListener('mouseup', onMouseUp);
      };
      document.body.addEventListener('mousemove', onMouseMove);
      document.body.addEventListener('mouseup', onMouseUp);
    };
    ref.current?.addEventListener('click', handleClick);
    ref.current?.addEventListener('mouseenter', handleMouseenter);
    ref.current?.addEventListener('mouseleave', handleMouseleave);
    ref.current?.addEventListener('mousemove', handleMousemove);
    move.current?.addEventListener('mousedown', onMouseDown);
    return () => {
      ref.current?.removeEventListener('click', handleClick);
      ref.current?.removeEventListener('mouseenter', handleMouseenter);
      ref.current?.removeEventListener('mouseleave', handleMouseleave);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current?.removeEventListener('mousemove', handleMousemove);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      move.current?.removeEventListener('mousedown', onMouseDown);
    };
  }, [starttime, endtime, onChange, playtime]);
  return (
    <div className={styles.timeline} style={{ cursor: 'pointer' }}>
      <canvas ref={ref} />
      <div className="move" ref={move} />
    </div>
  );
};
export default TimeLine;
