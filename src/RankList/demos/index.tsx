/*
 * @Date: 2023-09-25 15:19:42
 * @Description: description
 */
import React from 'react';
import { RankList } from 'react-gonglu-design';

function RankListDemo() {
  const data = Array.from(new Array(10)).map((_, idx) => ({
    label: `选项${idx + 1}`,
    value: 10 - idx,
  }));

  return (
    <div>
      <RankList data={data}></RankList>
    </div>
  );
}

export default RankListDemo;