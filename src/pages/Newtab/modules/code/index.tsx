import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { useEffect, useState } from 'react';
import React from 'react';

const MyCodeEditor = (props: any) => {
  const [code, setCode] = useState(``);
  useEffect(() => {
    setCode(props.code);
  }, [props]);
  return (
    <CodeMirror
      value={code}
      height="200px"
      extensions={[json()]} // 这里可以尝试替换为 Groovy 支持
      theme={oneDark}
      onChange={(value, viewUpdate) => {
        console.log(value, viewUpdate);
        setCode(value);
      }}
      onBlur={() => {
        props.codeChange(code);
      }}
    />
  );
};

export default MyCodeEditor;
