/*
 * @Date: 2023-09-12 10:08:00
 * @Description: description
 */
import React from "react";
import { ScrollBoard } from 'react-gonglu-design';
import styles from "./index.module.less";

const Scroll = () => {
  const columnsHandleConfig = {
    columnWidth: [100, 200, 100, 150],
    indexHeader: "#",
    rowNum: 5,
    headerHeight: 60,
    hoverPause: true,
    carousel: "single",
    evenRowBGC: "#91c242",
    oddRowBGC: "#c27542",
    align: ["center", "left", "left", "left"],
    columns: [
      {
        title: "矿山名称",
        dataIndex: "mineName",
        ellipsis: true,
        render: (e: string) => <span>{e}span</span>,
      },
      {
        title: "问题类型",
        dataIndex: "quesType",
        ellipsis: true,
      },
      {
        title: "状态",
        dataIndex: "status",
        ellipsis: false,
      },
    ],
    dataSource: [
      {
        mineName: "哇哈哈1",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈2",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈3",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈4",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈5",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈6",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈7",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈8",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈9",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈10",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
      {
        mineName: "哇哈哈11",
        quesType: "爽歪歪1",
        status: "乳酸菌",
      },
    ],
    waitTime: 2500,
    evenRowBorder: {
      border: 'none'
    },
    index: true,
    header: ["矿山名称", "问题类型", "状态"],
  };
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <ScrollBoard
          config={columnsHandleConfig}
          onClick={(ri: any, ci: any, row: any, ceil: any) => {
            console.log(ri, ci, row, ceil, "onClick");
          }}
        />
      </div>
    </div>
  );
};

export default Scroll;
