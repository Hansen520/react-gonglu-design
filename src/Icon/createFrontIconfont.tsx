import React, { FunctionComponent } from 'react';
import Icon, { IconProps } from './';

const loadedSet = new Set<string>();

export function createFromIconfont(
  scriptUrl: string,
): FunctionComponent<IconProps> {
  if (
    typeof scriptUrl === 'string' &&
    scriptUrl.length &&
    !loadedSet.has(scriptUrl)
  ) {
    const script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    document.body.appendChild(script);

    /* 避免重新加载 */
    loadedSet.add(scriptUrl);
  }

  const Iconfont = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { type, ...rest } = props;

    return (
      <Icon {...rest} ref={ref}>
        {type ? <use xlinkHref={`#${type}`} /> : null}
      </Icon>
    );
  });

  return Iconfont;
}
