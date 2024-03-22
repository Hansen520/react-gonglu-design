/*
 * @Date: 2024-03-22 14:00:08
 * @Description: description
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import './index.less';
// import { min } from 'lodash-es';

// cache_screens 为缓冲的屏幕数量
const VrScroll = ({ cache_screens = 1 }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const minHeightRef = useRef<number>(0); // 最小高度
  const listRef = useRef<any[]>([]); // list数据
  const ticking = useRef(false);
  const scrollScaleRef = useRef<any>([]);
  const maxNumRef = useRef<number>(0); // 最大数量
  const [runList, setRunList] = useState<any[]>([]); // 当前滚动的高度
  const [totalHeight, setTotalHeight] = useState(0); // 列表总高度

  /* 获取类名 */
  const getClass = useCallback(
    (item: { index: number; height: number; top: number; value: number }) => {
      switch (item.value % 3) {
        case 1:
          return 'one';
        case 2:
          return 'two';
        case 0:
          return 'three';
        default:
          return '';
      }
    },
    [],
  );

  const getHeight = (value: number) => {
    switch (value % 3) {
      case 1:
        return 50;
      case 2:
        return 100;
      case 0:
        return 150;
      default:
        return 0;
    }
  };

  /* 生成1-num的数据 */
  const createData = (num: number) => {
    let _num = num + 1;
    const arr = [];
    while (_num-- > 1) {
      arr.unshift(_num);
    }
    return arr;
  };

  /* 生成数据 */
  const genData = () => {
    let total_height = 0;
    const list = createData(100).map((value, index) => {
      const height = getHeight(value);
      const ob = {
        index,
        height,
        top: total_height,
        value,
      };
      total_height += height;
      return ob;
    });
    listRef.current = list as [];
    setTotalHeight(total_height); // 加个高度防止页面高度不够滚动条塌陷
    minHeightRef.current = 50;
  };

  /* 初始化的过程 */
  const init = useCallback(() => {
    const containerHeight = parseInt(
      getComputedStyle(wrapperRef.current as Element).height,
      10,
    );
    console.log(
      containerHeight,
      minHeightRef.current,
      Math.ceil(containerHeight / minHeightRef.current),
      31,
    );
    //一屏的最大数量
    maxNumRef.current = Math.ceil(containerHeight / minHeightRef.current);
  }, []);

  /* * 二分法计算起始索引, while就是一个找的过程 */
  const getStartIndex = (scrollTop: number) => {
    let start = 0,
      end = listRef.current.length - 1;
    while (start < end) {
      const midIndex = Math.floor((start + end) / 2);
      const { top, height } = listRef.current[midIndex];
      console.log(
        'top',
        top,
        'height',
        height,
        'scrollTop',
        scrollTop,
        'midIndex',
        midIndex,
        95,
      );
      if (scrollTop >= top && scrollTop <= top + height) {
        start = midIndex;
        break;
      } else if (scrollTop >= top + height) {
        start = midIndex + 1;
      } else if (scrollTop < top) {
        end = midIndex - 1;
      }
    }
    return start;
  };

  const getRunData = (distance: number = 0) => {
    // 滚动的总距离
    const scrollTop = distance ? distance : containerRef.current!.scrollTop;
    // console.log(scroll_scale.current, 110)
    // * 在那个范围内不执行滚动
    if (scrollScaleRef.current) {
      if (
        scrollTop > scrollScaleRef.current[0] &&
        scrollTop < scrollScaleRef.current[1]
      ) {
        return;
      }
    }

    /* 起始索引 */
    let start_index = getStartIndex(scrollTop);
    console.log(start_index, 119);
    start_index = start_index < 0 ? 0 : start_index;
    /* 上一屏的索引 */
    let upper_start_index = start_index - maxNumRef.current * cache_screens;
    upper_start_index = upper_start_index < 0 ? 0 : upper_start_index;
    /* 调整offset */
    containerRef.current!.style.transform = `translate3d(0,${listRef.current[upper_start_index].top}px,0)`;

    /* 中间屏幕的元素 */
    const mid_list = listRef.current.slice(
      start_index,
      start_index + maxNumRef.current,
    );

    /* 上屏 */
    const upper_list = listRef.current.slice(upper_start_index, start_index);

    /* 下屏元素 */
    let down_start_index = start_index + maxNumRef.current;

    down_start_index =
      down_start_index > listRef.current.length - 1
        ? listRef.current.length
        : down_start_index;

    scrollScaleRef.current = [
      listRef.current[Math.floor(upper_start_index + maxNumRef.current / 2)]
        .top,
      listRef.current[Math.ceil(start_index + maxNumRef.current / 2)].top,
    ];

    const down_list = listRef.current.slice(
      down_start_index,
      down_start_index + maxNumRef.current * cache_screens,
    );
    setRunList([...upper_list, ...mid_list, ...down_list]);
  };

  /* 滚动加载 */
  const onscroll = useCallback((e: any) => {
    console.log(e.target.scrollTop, 89);
    /* 做的一个开关，防流节抖 */
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
    });
    const distance = e.target.scrollTop;
    getRunData(distance); // 获取当前滚动的高度，也是dom渲染的关键数据
  }, []);

  useEffect(() => {
    genData();
    init();
    getRunData();
  }, []);

  return (
    <div className="vr-scroll-wrapper" ref={wrapperRef} onScroll={onscroll}>
      {/* 很贴心的加了背景的高度 */}
      <div
        className="vr-scroll-background"
        style={{ height: `${totalHeight}px` }}
      ></div>
      <div className="vr-scroll-list" ref={containerRef}>
        {runList &&
          runList.length > 0 &&
          runList.map((item, index) => {
            return (
              <div key={index} className={`vr-scroll-line ${getClass(item)}`}>
                <div className="vr-scroll-item lt">{item.value}</div>
                <div className={'vr-scroll-item gt'}>
                  {item.value}虚拟信息列表滚动展示
                </div>
                {item.value % 3 === 0 && (
                  <div className="img-container">
                    <img src="https://p6-flow-imagex-sign.byteimg.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/2685457248038084_1703664815498931309.jpeg~tplv-a9rns2rl98-icon-tiny.jpeg?rk3s=9956f44f&x-expires=1713680927&x-signature=l6cyTmiMNFQjJ7rHju8Xf74ukQ4%3D" />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default VrScroll;
