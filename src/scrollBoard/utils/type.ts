/*
 * @Date: 2024-05-27 15:50:11
 * @Description: 相关的类型描述
 */
/* 初始化数据 */
export type Globals =
  | '-moz-initial'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'revert-layer'
  | 'unset';
export interface defaultState {
  mergedConfig: any;
  header: string[];
  rows: any[];
  widths: number[];
  heights: number[];
  aligns: Array<
    | Globals
    | 'center'
    | 'end'
    | 'justify'
    | 'left'
    | 'match-parent'
    | 'right'
    | 'start'
  >;
}

/* 表头项目及字段以及是否出现tooltip */
interface Column {
  title: string;
  dataIndex: string;
  ellipsis?: boolean;
  render?: (dataIndex: string, allData: any) => void;
}

/* 边框样式 */
interface BorderStyle {
  border?: string;
  borderStyle?:
    | 'none'
    | 'hidden'
    | 'dotted'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset';
  borderWidth?: string;
  borderColor?: string;
  borderLeft?: string;
  borderRight?: string;
  borderTop?: string;
  borderBottom?: string;
}

/* 相关的配置信息 */
export interface ConfigData {
  columns: Array<Column>; // 表头字段加标题
  dataSource: any[]; // 数据源信息
  header?: Array<string>; // 表头数据
  column?: Column; // 列行数据
  data?: Array<[]>; // 表数据
  rowNum: number; // 表行数
  headerColor?: string; // 头部文本颜色
  rowColor?: string; // 列表文本颜色
  headerBGC?: string; // 表头背景色
  oddRowBGC?: string; // 奇数行背景色
  evenRowBGC?: string; // 偶数行背景色
  oddRowBorder?: BorderStyle; // 奇数行边框
  evenRowBorder?: BorderStyle; // 偶数行边框
  waitTime?: number; // 轮播时间间隔(ms)
  headerHeight?: number; // 表头高度
  columnWidth: Array<number>; // 列宽度
  align?: Array<string>; // 列对齐方式
  index?: boolean; // 显示行号
  indexHeader?: string; // 行号表头
  carousel?: string; // 轮播方式
  hoverPause?: boolean; // 悬浮暂停轮播
}

/* 基础的配置 */
export interface Base {
  onClick?: any;
  config: ConfigData;
  className?: any;
  style?: any;
  onMouseOver?: any;
}
