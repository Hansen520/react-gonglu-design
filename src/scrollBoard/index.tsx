import { useEffect, useState, useRef, useMemo, forwardRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { merge, cloneDeep } from "lodash-es";
import useAutoResize from "./utils/autoResize";
import { co } from "./utils";
import { defaultState, Base, ConfigData } from "./utils/type";
import { Tooltip } from "antd";
import "./index.less";

const defaultConfig = {
  /**
   * @description 头部标题加字段
   * @type {Array<String>}
   * @default columns = []
   * @example columns = [{ title: '', dataIndex: '', ellipsis: false }]
   */
  columns: [
    {
      title: "",
      dataIndex: "",
      ellipsis: false,
    },
  ],
  /**
   * @description 数据源信息
   * @type {Array<Array>}
   * @default data = []
   */
  dataSource: [],
  /**
   * @description Board header
   * @type {Array<String>}
   * @default header = []
   * @example header = ['column1', 'column2', 'column3']
   */
  header: [],
  /**
   * @description Board data
   * @type {Array<Array>}
   * @default data = []
   */
  data: [],
  /**
   * @description Row num
   * @type {Number}
   * @default rowNum = 5
   */
  rowNum: 5,
  /**
   * @description Header background color
   * @type {String}
   * @default headerBGC = '#62c9e9'
   */
  headerBGC: "#62c9e9",
  /**
   * @description Odd row background color
   * @type {String}
   * @default oddRowBGC = '#4fa3c2cc'
   */
  oddRowBGC: "#4fa3c2cc",
  /**
   * @description Even row background color
   * @type {String}
   * @default evenRowBGC = '#5097592c'
   */
  evenRowBGC: "#5097592c",
  /**
   * @description Odd row border color
   * @type {String}
   * @default oddRowBorder = {
   *  borderWidth: '0 2px 0 2px',
      borderStyle: 'dashed',
      borderColor: '#37ecc5',
   * }
   */
  oddRowBorder: {
    borderWidth: "0 2px 0 2px",
    borderStyle: "dashed",
    borderColor: "#37ecc5",
  },
  /**
   * @description Even row border color
   * @type {String}
   * @default evenRowBorder = {
   * borderWidth: '0 2px 0 2px',
     borderStyle: 'dashed',
     borderColor: '#37ecc5',
   * }
   */
  evenRowBorder: {
    borderWidth: "0 2px 0 2px",
    borderStyle: "dashed",
    borderColor: "#37ecc5",
  },
  /**
   * @description header color
   * @type {String}
   * @default evenRowBGC = '#000000'
   */
  headerColor: "#000000",
  /**
   * @description row color
   * @type {String}
   * @default rowColor = '#fff'
   */
  rowColor: "#fff",
  /**
   * @description Scroll wait time
   * @type {Number}
   * @default waitTime = 2000
   */
  waitTime: 2000,
  /**
   * @description Header height
   * @type {Number}
   * @default headerHeight = 35
   */
  headerHeight: 35,
  /**
   * @description Column width
   * @type {Array<Number>}
   * @default columnWidth = []
   */
  columnWidth: [],
  /**
   * @description Column align
   * @type {Array<String>}
   * @default align = []
   * @example align = ['left', 'center', 'right']
   */
  align: [],
  /**
   * @description Show index
   * @type {Boolean}
   * @default index = false
   */
  index: false,
  /**
   * @description index Header
   * @type {String}
   * @default indexHeader = '#'
   */
  indexHeader: "#",
  /**
   * @description Carousel type
   * @type {String}
   * @default carousel = 'single'
   * @example carousel = 'single' | 'page'
   */
  carousel: "single",
  /**
   * @description Pause scroll when mouse hovered
   * @type {Boolean}
   * @default hoverPause = true
   * @example hoverPause = true | false
   */
  hoverPause: true,
};

// 增加溢出Tooltip
const formatTip = (text: any, item: any) => {
  return item.ellipsis ? (
    <Tooltip placement="topLeft" title={text}>
      {text}
    </Tooltip>
  ) : (
    text
  );
};

/* 计算头部信息 */
function calcHeaderData({ header, index, indexHeader }: any) {
  if (!header.length) {
    return [];
  }

  /* 浅复制 */
  header = [...header];

  /* 判断有无#或其他标志，有则推进 */
  if (index) header.unshift(indexHeader);

  /* 返回头部 */
  return header;
}

/* 计算列 */
function calcRows({
  data,
  index,
  headerBGC,
  rowNum,
}: {
  data: any[];

  index?: boolean;

  headerBGC?: string;

  rowNum: number;
}) {
  /* 判断有无头标索引值 */
  if (index) {
    data = data.map((row: any, i: any) => {
      row = [...row];

      const indexTag = (
        <span className="index" style={{ backgroundColor: headerBGC }}>
          {i + 1}
        </span>
      );

      row.unshift(indexTag);

      return row;
    });
  }

  /* 数据重组 */
  data = data.map((ceils: any, i: any) => ({ ceils, rowIndex: i }));
  /* 列长度 */
  const rowLength = data.length;

  /* 判断是否数据有超出预定的条数 */
  if (rowLength > rowNum) {
    /* 避免出现最后和第一条的样式是一样的情况 */
    data = [...data, ...data];
  }
  return data.map((d: any, i: any) => ({ ...d, scroll: i }));
}

/* 对齐方式的计算 */
function calcAligns(mergedConfig: any, header: any) {
  const columnNum = header.length;

  let aligns = new Array(columnNum).fill("left");

  const { align } = mergedConfig;

  return merge(aligns, align);
}

/* 滚动的入口 */
const ScrollBoard = forwardRef(({ onClick, config, className, style, onMouseOver }: Base, ref: any) => {
  const { width, height, domRef } = useAutoResize(ref);
  const [state, setState] = useState<defaultState>({
    mergedConfig: null,
    header: [],
    rows: [],
    widths: [],
    heights: [],
    aligns: [],
  });

  const { mergedConfig, header, rows, widths, heights, aligns } = state;

  /* ref 开始的数据 */
  const stateRef = useRef<defaultState & { rowsData: any[]; avgHeight: number; animationIndex: number }>({
    ...state,
    rowsData: [],
    avgHeight: 0,
    animationIndex: 0,
  });

  Object.assign(stateRef.current, state);

  /* 自适应的时候重新计算 */
  function onResize() {
    if (!mergedConfig) return;

    const widths = calcWidths(mergedConfig, stateRef.current.rowsData);

    const heights = calcHeights(mergedConfig, header);

    const data = { widths, heights };

    Object.assign(stateRef.current, data);

    setState((state: defaultState) => ({ ...state, ...data }));
  }

  /* 数据的二次处理 */
  const handleData = (config: ConfigData): ConfigData => {
    const data: any[] = [];
    config.dataSource.forEach((rows) => {
      const inData: any[] = [];
      config.columns.forEach((cols) => {
        /* 在原来的基础上进行回调 */
        const val = cols.render ? cols.render(rows[cols.dataIndex], rows) : formatTip(rows[cols.dataIndex], cols);
        inData.push(val);
      });
      data.push(inData);
    });

    return {
      ...config,
      header: config.columns.map((item) => item.title),
      data,
    };
  };

  /* 数据重组计算 */
  const calcData = () => {
    /* 合并配置项 */
    const mergedConfig: any = handleData(merge(cloneDeep(defaultConfig), config || {}));

    /* 头部计算与扩展 */
    const header = calcHeaderData(mergedConfig);

    /* rows 列的计算 */
    const rows = calcRows(mergedConfig);

    /* 宽度计算 rowsData = rows */
    const widths = calcWidths(mergedConfig, stateRef.current.rowsData);

    /* 高度的计算 */
    const heights = calcHeights(mergedConfig, header);

    /* 对齐方式的计算 */
    const aligns = calcAligns(mergedConfig, header);

    const data = {
      mergedConfig,
      header,
      rows,
      widths,
      aligns,
      heights,
    };

    /* 这边是数据的合并操作 */
    Object.assign(stateRef.current, data, {
      rowsData: rows,
      animationIndex: 0,
    });

    setState((state: any) => ({ ...state, ...data }));
  };

  console.log(rows, 341);
  /* 计算宽度 */
  const calcWidths = ({ columnWidth, header }: any, rowsData: any) => {
    /* 总宽 */
    const usedWidth = columnWidth.reduce((all: number, w: number) => all + w, 0);

    let columnNum = 0;

    if (rowsData[0]) {
      columnNum = rowsData[0].ceils.length;
    } else if (header.length) {
      columnNum = header.length;
    }
    const avgWidth = (width - usedWidth) / (columnNum - columnWidth.length);

    const widths = new Array(columnNum).fill(avgWidth);

    return merge(widths, columnWidth);
  };

  /* 计算 rows 的高度并且平均分配 */
  function calcHeights({ headerHeight, rowNum, data }: any, header: any) {
    let allHeight = height;

    if (header.length) allHeight -= headerHeight;

    const avgHeight = allHeight / rowNum;

    Object.assign(stateRef.current, { avgHeight });

    return new Array(data.length).fill(avgHeight);
  }

  /* 执行动画函数，向上推动 */
  function* animation(start = false) {
    let {
      avgHeight /* 均高 */,
      animationIndex,
      mergedConfig: { waitTime, carousel, rowNum },
      rowsData,
    } = stateRef.current;

    // debugger
    const rowLength = rowsData.length;
    if (start) yield new Promise((resolve) => setTimeout(resolve, waitTime));

    const animationNum = carousel === "single" ? 1 : rowNum;

    /* 移动时候获取当前位置到最后的所有数据 */
    let rows = rowsData.slice(animationIndex);

    /* 将消失的数据推宋到rows的末尾 */
    rows.push(...rowsData.slice(0, animationIndex));

    rows = rows.slice(0, carousel === "page" ? rowNum * 2 : rowNum + 1);

    const heights = new Array(rowLength).fill(avgHeight);

    setState((state: any) => ({ ...state, rows, heights }));

    yield new Promise((resolve) => setTimeout(resolve, 300));

    animationIndex += animationNum;

    /* 判断是否走完所有的数据，若走完则 index 复原 */
    const back = animationIndex - rowLength;

    if (back >= 0) animationIndex = back;

    const newHeights = [...heights];

    /* 第0条高度变为0 */
    newHeights.splice(0, animationNum, ...new Array(animationNum).fill(0));

    Object.assign(stateRef.current, { animationIndex });

    setState((state: any) => ({ ...state, heights: newHeights }));
  }

  /* 转发事件 */
  function emitEvent(handle: any, ri: any, ci: any, row: any, ceil: any) {
    const { ceils, rowIndex } = row;

    handle && handle({ row: ceils, ceil, rowIndex, columnIndex: ci });
  }

  /* 浮动的处理 */
  function handleHover(enter: boolean, ri?: any, ci?: any, row?: any, ceil?: any) {
    /* onMouseOver 为事件名称 */
    if (enter) emitEvent(onMouseOver, ri, ci, row, ceil);

    if (!mergedConfig.hoverPause) return;

    const { pause, resume } = task.current;

    enter && pause && resume
      ? pause()
      : (function () {
          if (resume) resume();
        })();
  }

  const getBackgroundColor = (rowIndex: number) => mergedConfig[rowIndex % 2 === 0 ? "evenRowBGC" : "oddRowBGC"];
  const getBorderStyle = (rowIndex: number) => mergedConfig[rowIndex % 2 === 0 ? "evenRowBorder" : "oddRowBorder"];

  const task = useRef<any>({});

  void useEffect(() => {
    calcData();

    let start = true;

    /* 数据循环执行 */
    function* loop() {
      /* while用于不断的数据轮询 */
      while (true) {
        /* animation(start) 这一步要先执行完毕再跳转到下一步 */
        yield* animation(start);
        start = false;
        const { waitTime }: any = stateRef.current.mergedConfig;

        /* setTimeout(resolve, waitTime - 300先执行，再执行Promise方法，最后await成功后再继续执行后续的方法 */
        yield new Promise((resolve) => setTimeout(resolve, waitTime - 300));
      }
    }

    const {
      mergedConfig: { rowNum },
      rows: rowsData,
    } = stateRef.current;

    const rowLength = rowsData.length;

    /* 如果是显示的数量小于数据总长度则停止轮询 */
    if (rowNum >= rowLength) return;

    /* 开始轮询的关键代码 */
    task.current = co(loop);
    // debugger
    return task.current.end;
    // domRef.current render2次导致的变化
  }, [config, domRef.current]);

  useEffect(onResize, [width, height, domRef.current]);

  const classNames = useMemo(() => classnames("dv-scroll-board", className), [className]);

  return (
    <div className={classNames} style={style} ref={domRef}>
      {!!header.length && !!mergedConfig && (
        <div className="header" style={{ backgroundColor: `${mergedConfig.headerBGC}` }}>
          {header.map((headerItem, i) => (
            <div
              className="header-item"
              key={`${headerItem}-${i}`}
              style={{
                height: `${mergedConfig.headerHeight}px`,
                lineHeight: `${mergedConfig.headerHeight}px`,
                width: `${widths[i]}px`,
                textAlign: aligns[i],
                color: `${mergedConfig.headerColor}`,
              }}
              dangerouslySetInnerHTML={{ __html: headerItem }}
            />
          ))}
        </div>
      )}

      {!!mergedConfig && (
        <div
          className="rows"
          style={{
            height: `${height - (header.length ? mergedConfig.headerHeight : 0)}px`,
          }}
        >
          {rows && rows.length > 0 ? rows.map((row, ri) => (
            <div
              className="row-item"
              key={`${row.toString()}-${row.scroll}`}
              style={{
                height: `${heights[ri]}px`,
                lineHeight: `${heights[ri]}px`,
                backgroundColor: `${getBackgroundColor(row.scroll)}`,
                color: mergedConfig.rowColor,
                ...getBorderStyle(row.scroll),
              }}
            >
              {row.ceils.map((ceil: any, ci: any) => (
                <div
                  className="ceil"
                  key={`${ceil}-${ri}-${ci}`}
                  style={{ width: `${widths[ci]}px`, textAlign: aligns[ci]}}
                  onClick={() => emitEvent(onClick, ri, ci, row, ceil)}
                  onMouseEnter={() => handleHover(true, ri, ci, row, ceil)}
                  onMouseLeave={() => handleHover(false)}
                >
                  {ceil}
                </div>
              ))}
            </div>
          )) : '暂无数据'}
        </div>
      )}
    </div>
  );
});

ScrollBoard.propTypes = {
  config: PropTypes.object,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ScrollBoard;
