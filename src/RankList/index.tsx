/*
 * @Date: 2023-09-25 09:51:58
 * @Description: 静态排名组件
 */
import React, { useEffect, useState } from 'react';
import './index.less';

interface RankListProps {
  data: any[]; /* 数据 */
  header: string[]; /* header 数据 */
  leftIndex?: boolean; /* 用来判断是否有前面排名标号 */
  leftIndexName?: string; /* 左边标号的名字 */
  headColor?: string; /* 头部颜色 */
  bodyColor?: string; /* body颜色 */
  count?: number; /* 控制展示数据的多少 */
}

function RankList({
  data = [],
  header = [],
  leftIndex = true,
  leftIndexName = '排名',
  headColor = '#000',
  bodyColor = '#000',
  count = 8
}: RankListProps) {
  const [headerData, setHeadData] = useState<string[]>(header);
  const [rankData, setRankData] = useState<string[][]>();
  useEffect(() => {
    if (leftIndex) {
      setHeadData((pre: string[]) => {
        pre.unshift(leftIndexName);
        return pre;
      });
    }
    const inData: any = [];
    data.forEach((item: any) => {
      if (!item) {
        return {};
      }
      const values: any = [];
      for (let key of Object.keys(item)) {
        values.push(item[key]);
      }
      inData.push(values);
    });
    setRankData(inData);
  }, []);
  return (
    <div className="gong-lu_rank-list">
      <ul className="gong-lu_header" style={{ color: headColor }}>
        {headerData &&
          headerData.map((item, index) => (
            <React.Fragment key={index}>
              <li>{item}</li>
            </React.Fragment>
          ))}
      </ul>
      {rankData && rankData.length ? (
        <ul className="gong-lu_body" style={{ color: bodyColor }}>
          {rankData
            .filter((_, index) => index < count)
            .map((item, index) => (
              <li key={index} className={`gong-lu_body-li${index}`}>
                {leftIndex && (
                  <div className="gong-lu_flex gong-lu_name">
                    <div className='gong-lu_index'>{index + 1}</div>
                  </div>
                )}
                {item.map((value: string, _index: number) => (
                  <div className="gong-lu_flex gong-lu_name" key={_index}>
                    <span title={value || '-'}>{value || '-'}</span>
                  </div>
                ))}
              </li>
            ))}
        </ul>
      ) : (
        <div className="gong-lu-empty">暂无数据</div>
      )}
    </div>
  );
}

export default RankList;
