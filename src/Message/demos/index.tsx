/*
 * @Date: 2023-09-26 16:27:23
 * @Description: description
 */
import { Button } from 'antd';
import ConfigProvider from '../configProvider';
import useMessage from '../useMessage';

function Aaa() {
  const message = useMessage();
  return (
    <Button
      onClick={() => {
        message?.add({
          content: '请求成功',
        });
      }}
    >
      成功
    </Button>
  );
}

function Demos() {
  return (
    <ConfigProvider>
      <div>
        <Aaa />
      </div>
    </ConfigProvider>
  );
}

export default Demos;
