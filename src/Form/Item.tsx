import Schema from 'async-validator';
import classNames from 'classnames';
import {
  ChangeEvent,
  Children,
  cloneElement,
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import FormContext from './FormContext';

export interface ItemProps {
  name: string;
  label?: ReactNode;
  rules?: any;
  required?: boolean;
  message?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  valuePropName?: string;
}

const getValueFromEvent = (e: ChangeEvent<HTMLInputElement>) => {
  const { target } = e;
  if (target.type === 'checkbox') {
    return target.checked;
  } else if (target.type === 'radio') {
    return target.value;
  }

  return target.value;
};

const Item = (props: ItemProps) => {
  const { className, label, children, style, name, valuePropName, rules } =
    props;

  const [value, setValue] = useState<string | number | boolean>();
  const [error, setError] = useState('');

  const { onValueChange, values, validateRegister } = useContext(FormContext);
  useEffect(() => {
    if (value !== values?.[name]) {
      setValue(values?.[name]);
    }
  }, [values, values?.[name]]);

  /* 处理校验的 */
  const handleValidate = (value: any) => {
    let errorMsg = null;
    if (Array.isArray(rules) && rules.length) {
      const validator = new Schema({
        [name]: rules.map((rule) => {
          return {
            type: 'string',
            ...rule,
          };
        }),
      });

      validator.validate({ [name]: value }, (errors) => {
        if (errors) {
          if (errors?.length) {
            console.log(errors[0], 68);
            setError(errors[0].message!);
            errorMsg = errors[0].message;
          }
        } else {
          setError('');
          errorMsg = null;
        }
      });
    }
    return errorMsg;
  };

  useEffect(() => {
    validateRegister?.(name, () => handleValidate(value));
  }, [value]);

  if (!name) {
    return children;
  }

  /* 属性名 */
  const propsName: Record<string, any> = {};
  if (valuePropName) {
    propsName[valuePropName] = value;
  } else {
    propsName.value = value;
  }

  const childEle =
    Children.toArray(children).length > 1
      ? children
      : cloneElement(children as any, {
          ...propsName,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            const value = getValueFromEvent(e);
            console.log(value, 104);
            setValue(value);
            onValueChange?.(name, value);

            handleValidate(value);
          },
        });

  const cls = classNames('ant-form-item', className);

  return (
    <div className={cls} style={style}>
      <div>{label && <label>{label}</label>}</div>
      <div>
        {childEle}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default Item;
