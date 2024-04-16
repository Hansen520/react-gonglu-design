/*
 * @Date: 2024-04-15 10:47:51
 * @Description: description
 */
import classNames from 'classnames';
import React, {
  CSSProperties,
  FormEvent,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import FormContext from './FormContext';

export interface FormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: CSSProperties;
  initialValues?: any;
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (errors: Record<string, any>) => void;
  children?: ReactNode;
  form?: any;
}

export interface FormRefApi {
  getFieldsValue: () => Record<string, any>;
  setFieldsValue: (values: Record<string, any>) => void;
}

const Form = forwardRef<FormRefApi, FormProps>((props: FormProps, ref) => {
  const {
    className,
    style,
    initialValues,
    onFinish,
    onFinishFailed,
    children,
  } = props;
  const [values, setValues] = useState<Record<string, any>>(
    initialValues || {},
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        /* 获取所有的值 */
        getFieldsValue() {
          return values;
        },
        /* 通过循环将值赋值上去 */
        setFieldsValue(values) {
          for (let [key, value] of Object.entries(values)) {
            values[key] = value;
          }
          setValues(values);
        },
      };
    },
    [],
  );

  const validatorMap = useRef<any>(new Map<string, () => void>());

  const errors = useRef<Record<string, any>>({});

  const onValueChange = (key: string, value: any) => {
    values[key] = value;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    for (let [key, callbackFunc] of validatorMap.current) {
      if (typeof callbackFunc === 'function') {
        errors.current[key] = callbackFunc();
      }
    }

    const errorList = Object.keys(errors.current)
      .map((key) => {
        return errors.current[key];
      })
      .filter(Boolean);

    if (errorList.length > 0) {
      onFinishFailed?.(errors.current);
    } else {
      onFinish?.(values);
    }
  };
  const handleValidateRegister = (name: string, cb: any) => {
    validatorMap.current.set(name, cb);
  };

  const cls = classNames('ant-form', className);

  return (
    <FormContext.Provider
      value={{
        onValueChange,
        values,
        setValues: (v) => setValues(v),
        validateRegister: handleValidateRegister,
      }}
    >
      <form className={cls} style={style} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
});

export default Form;
