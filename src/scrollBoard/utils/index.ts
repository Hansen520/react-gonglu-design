/*
 * @Date: 2023-09-12 10:20:48
 * @Description: description
 */
export function observerDomResize(dom: any, callback: any) {
    /* 监听dom树的能力 */
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  
    const observer = new MutationObserver(callback);
  
    observer.observe(dom, {
      attributes: true,
      attributeFilter: ["style"],
      attributeOldValue: true,
    });
  
    return observer;
  }
  
  export const co = (gen: any) => {
    let destroyed = false;
  
    // 处理 return 之后 resume 的问题
    let stop = false;
  
    let val: any = null;
  
    if (typeof gen === "function") gen = gen();
  
    if (!gen || typeof gen.next !== "function") return () => ({});
  
    Promise.resolve().then(() => {
      destroyed || next(gen.next());
    });
  
    return {
      /* 结束 */
      end() {
        destroyed = true;
  
        Promise.resolve().then(() => {
          gen.return();
  
          gen = null;
        });
      },
      /* 暂停 */
      pause() {
        if (!destroyed) {
          stop = true;
        }
      },
      /* 继续 */
      resume() {
        const oldVal = val;
  
        if (!destroyed && stop) {
          stop = false;
  
          Promise.resolve(val).then(() => {
            if (!destroyed && !stop && oldVal === val) {
              /* 继续执行轮播 */
              next(gen.next());
            }
          });
        }
      },
    };
  
    function next(ret: any) {
      if (ret.done) return ret.value;
  
      val = ret.value;
  
      return Promise.resolve(ret.value).then(() => {
        /* 连续滚动轮播列表的代码 */
        !destroyed && !stop && next(gen.next());
      });
    }
  };
  