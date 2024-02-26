/*
 * @Date: 2024-02-22 16:49:20
 * @Description: description
 */
import { createFromIconfont } from '../createFrontIconfont';
import { IconAdd } from './icons/IconAdd';
import { IconEmail } from './icons/IconEmail';

const IconFont = createFromIconfont(
  '//at.alicdn.com/t/c/font_4443338_a2wwqhorbk4.js',
);

function Demos() {
  return (
    <div style={{ padding: '60px' }}>
      <IconAdd size={'40px'} />
      <IconAdd spin size={'40px'} />
      <IconAdd reverseSpin size={'40px'} style={{ marginLeft: '-40px' }} />
      <IconEmail style={{ color: 'blue', fontSize: '50px' }} />
      <IconFont type="icon-shouye-zhihui" size="40px"></IconFont>
      <IconFont
        type="icon-gerenzhongxin-zhihui"
        fill="blue"
        size="40px"
      ></IconFont>
    </div>
  );
}

export default Demos;
