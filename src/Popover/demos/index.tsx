/*
 * @Date: 2024-04-19 13:03:40
 * @Description: description
 */
import {
  offset,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import { Button } from 'antd';
import { useState } from 'react';
import './index.less';

function Demos() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    // 配置其他Floating UI的参数
    placement: 'right',
    middleware: [offset(10)],
  });

  const hover = useHover(context);
  // const click = useClick(context);
  // const dismiss = useDismiss(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([hover]);

  return (
    <div style={{ position: 'relative' }}>
      <Button
        ref={refs.setReference}
        {...getReferenceProps}
        style={{ position: 'relative' }}
      >
        hello
      </Button>
      {isOpen && (
        <div
          className="popover-floating"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          hanHanHanHanHan
        </div>
      )}
    </div>
  );
}

export default Demos;
