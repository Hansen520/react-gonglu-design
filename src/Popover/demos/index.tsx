import { useFloating, useHover, useInteractions } from '@floating-ui/react';
import { Button } from 'antd';
import { useState } from 'react';

function Demos() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    // 配置其他Floating UI的参数
  });

  const hover = useHover(context);

  const { getReferenceProps } = useInteractions([hover]);

  return (
    <>
      <Button ref={refs.setReference} {...getReferenceProps}>
        hello
      </Button>
    </>
  );
}

export default Demos;
