/*
 * @Date: 2023-09-25 15:19:42
 * @Description: description
 */
import React from 'react';
import { RankList } from 'react-gonglu-design';

function RankListDemo() {
  const data = Array.from(new Array(10)).map((_, idx) => ({
    carNo: `浙A.BX310${idx}`,
    type: '普通组件',
    transCount: 3658 - idx * 8
  }));
  console.log(data, 16);
  return (
    <div>
      <RankList data={data} header={['车牌号码', '类型', '总量(万吨)']}></RankList>
    </div>
  );
}

export default RankListDemo;