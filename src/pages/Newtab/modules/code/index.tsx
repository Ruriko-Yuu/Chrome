import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import React, { useEffect, useRef, useState } from 'react';

const MyCodeEditor = (props: any) => {
  const [code, setCode] = useState(props.code ?? '');
  const focused = useRef(false);
  // 外部配置变化（如右侧面板修改）实时同步到编辑器，编辑中不打断输入
  useEffect(() => {
    if (!focused.current) {
      setCode(props.code);
    }
  }, [props.code]);
  return (
    <CodeMirror
      value={code}
      height={props.height ?? '200px'}
      extensions={[json()]}
      theme={oneDark}
      onFocus={() => {
        focused.current = true;
      }}
      onBlur={() => {
        focused.current = false;
        props.codeChange?.(code);
      }}
      onChange={(value) => {
        setCode(value);
        props.codeChange?.(value);
      }}
    />
  );
};

export default MyCodeEditor;
