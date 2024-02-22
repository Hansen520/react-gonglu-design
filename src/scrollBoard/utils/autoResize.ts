/*
 * @Date: 2023-09-12 10:05:43
 * @Description: description
 */
import { debounce } from 'lodash-es';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { observerDomResize } from './index';

export default function useAutoResize(ref: any) {
  const domRef = useRef<any>(null);
  const [state, setState] = useState({ width: 0, height: 0 });

  const setWH = useCallback(() => {
    const { clientWidth, clientHeight } = domRef.current || {
      clientWidth: 0,
      clientHeight: 0,
    };

    setState({ width: clientWidth, height: clientHeight });

    if (!domRef.current) {
      console.warn('没有获取到DOM!');
    } else if (!clientWidth || !clientHeight) {
      console.warn('组件高度或者宽度为0，可能会发生组件异常!');
    }
  }, []);

  useImperativeHandle(ref, () => ({ setWH }), []);

  /* 做了一层防抖节流 */
  useEffect(() => {
    const debounceSetWHFun = debounce(setWH, 100);

    debounceSetWHFun();

    const domObserver = observerDomResize(domRef.current, debounceSetWHFun);

    window.addEventListener('resize', debounceSetWHFun);

    return () => {
      window.removeEventListener('resize', debounceSetWHFun);

      if (!domObserver) {
        return;
      }

      domObserver.disconnect();
      domObserver.takeRecords();
    };
  }, []);

  return { ...state, domRef, setWH };
}
