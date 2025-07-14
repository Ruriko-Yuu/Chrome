import React, { useState, useEffect, useRef, memo } from 'react';
import './index.scss';
const KeyboardSpace = memo<any>((props: any) => {
  const [state, setState] = useState({ loadOver: true });
  const [keysState, setKeysState] = useState<any>({});
  const keysStateRef = useRef(keysState); // 用 ref 存储最新值

  // 同步更新 ref
  useEffect(() => {
    keysStateRef.current = keysState;
  }, [keysState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 检测 F5 或 Ctrl + R / Cmd + R（Mac）
      if (
        event.key === 'F4' ||
        event.key === 'F5' ||
        event.key === 'F6' ||
        event.key === 'F7' ||
        event.key === 'F10' ||
        event.key === 'F11' ||
        event.key === 'F12' ||
        (event.ctrlKey && event.key === 'r') ||
        (event.metaKey && event.key === 'r')
      ) {
        event.preventDefault(); // 阻止刷新
        // 这里可以替换为你的自定义逻辑（如弹出确认框）
      }
      const currentState = { ...keysStateRef.current };
      if (currentState[event.code]) return; // 避免重复触发
      currentState[event.code] = true;
      setKeysState(currentState);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const currentState = { ...keysStateRef.current };
      currentState[event.code] = false;
      setKeysState(currentState);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // 空依赖，只运行一次

  // 调试输出
  useEffect(() => {
    console.log('当前按键状态:', keysState);
  }, [keysState]);
  // // 在游戏循环中检测按键状态
  // function gameLoop() {
  //   if (keysState['ArrowUp']) {
  //     console.log('正在按住 ↑ 键');
  //   }
  //   if (keysState['Space']) {
  //     console.log('正在按住空格键');
  //   }
  //   requestAnimationFrame(gameLoop);
  // }
  // gameLoop();
  const KeyHtml = (config: { key: string; text: string | Array<string>;  width?: number }) => {
    return (
      <div
        className={`key${keysState[config.key] === false ? ' pressed' : ''}${
          keysState[config.key] === true ? ' active' : ''
          }`}
        style={{ width: config.width ? 50 * config.width + 'px' : '50px' }}
      >
        {config.text instanceof Array
          ? config.text.map((ele) => <p key={ele}>{ele}</p>)
          : config.text}
      </div>
    );
  };
  return (
    <div className="keyboard-space">
      <div className={state.loadOver ? 'content over' : 'content'}>
        <i
          className="close"
          onClick={() => {
            setState({ loadOver: false });
            setTimeout(() => {
              props.removeCollectionActive();
            }, 46e1);
          }}
        >
          ✖
        </i>
        <div className="keyboard--history">
          <div className="keyboard">
            <div className="key-area">
              <div className="top-left">
                {KeyHtml({ key: 'Escape', text: 'Esc' })}
                <div className="key-block-area">
                  <div className="key-block">
                    {KeyHtml({ key: 'F1', text: 'F1' })}
                    {KeyHtml({ key: 'F2', text: 'F2' })}
                    {KeyHtml({ key: 'F3', text: 'F3' })}
                    {KeyHtml({ key: 'F4', text: 'F4' })}
                  </div>
                  <div className="key-block">
                    {KeyHtml({ key: 'F5', text: 'F5' })}
                    {KeyHtml({ key: 'F6', text: 'F6' })}
                    {KeyHtml({ key: 'F7', text: 'F7' })}
                    {KeyHtml({ key: 'F8', text: 'F8' })}
                  </div>
                  <div className="key-block">
                    {KeyHtml({ key: 'F9', text: 'F9' })}
                    {KeyHtml({ key: 'F10', text: 'F10' })}
                    {KeyHtml({ key: 'F11', text: 'F11' })}
                    {KeyHtml({ key: 'F12', text: 'F12' })}
                  </div>
                </div>
              </div>
              <div className="top-middle"></div>
              <div className="top-right"></div>
              <div className="bottom-left">
                <div className='key-block'>
                  <div>{KeyHtml({ key: 'Backquote', text: ['~', '`'] })}</div>
                  <div>{KeyHtml({ key: 'Digit1', text: ['!', '1'] })}</div>
                  <div>{KeyHtml({ key: 'Digit2', text: ['@', '2'] })}</div>
                  <div>{KeyHtml({ key: 'Digit3', text: ['#', '3'] })}</div>
                  <div>{KeyHtml({ key: 'Digit4', text: ['$', '4'] })}</div>
                  <div>{KeyHtml({ key: 'Digit5', text: ['%', '5'] })}</div>
                  <div>{KeyHtml({ key: 'Digit6', text: ['^', '6'] })}</div>
                  <div>{KeyHtml({ key: 'Digit7', text: ['&', '7'] })}</div>
                  <div>{KeyHtml({ key: 'Digit8', text: ['*', '8'] })}</div>
                  <div>{KeyHtml({ key: 'Digit9', text: ['(', '9'] })}</div>
                  <div>{KeyHtml({ key: 'Digit0', text: [')', '0'] })}</div>
                  <div>{KeyHtml({ key: 'Minus', text: ['_', '-'] })}</div>
                  <div>{KeyHtml({ key: 'Equal', text: ['+', '='] })}</div>
                  <div>{KeyHtml({ key: 'Backspace', text: 'Backspace', width: 2 })}</div>
                </div>
                <div className='key-block'>
                  <div>{KeyHtml({ key: 'KeyQ', text: 'Q' })}</div>
                  <div>{KeyHtml({ key: 'KeyW', text: 'W' })}</div>
                  <div>{KeyHtml({ key: 'KeyE', text: 'E' })}</div>
                  <div>{KeyHtml({ key: 'KeyR', text: 'R' })}</div>
                  <div>{KeyHtml({ key: 'KeyT', text: 'T' })}</div>
                  <div>{KeyHtml({ key: 'KeyY', text: 'Y' })}</div>
                  <div>{KeyHtml({ key: 'KeyU', text: 'U' })}</div>
                  <div>{KeyHtml({ key: 'KeyI', text: 'I' })}</div>
                  <div>{KeyHtml({ key: 'KeyO', text: 'O' })}</div>
                  <div>{KeyHtml({ key: 'KeyP', text: 'P' })}</div>
                </div>
                <div className='key-block'>
                  <div>{KeyHtml({ key: 'KeyA', text: 'A' })}</div>
                  <div>{KeyHtml({ key: 'KeyS', text: 'S' })}</div>
                  <div>{KeyHtml({ key: 'KeyD', text: 'D' })}</div>
                  <div>{KeyHtml({ key: 'KeyF', text: 'F' })}</div>
                  <div>{KeyHtml({ key: 'KeyG', text: 'G' })}</div>
                  <div>{KeyHtml({ key: 'KeyH', text: 'H' })}</div>
                  <div>{KeyHtml({ key: 'KeyJ', text: 'J' })}</div>
                  <div>{KeyHtml({ key: 'KeyK', text: 'K' })}</div>
                  <div>{KeyHtml({ key: 'KeyL', text: 'L' })}</div>
                </div>
                <div className='key-block'>
                  <div>{KeyHtml({ key: 'KeyZ', text: 'Z' })}</div>
                  <div>{KeyHtml({ key: 'KeyX', text: 'X' })}</div>
                  <div>{KeyHtml({ key: 'KeyC', text: 'C' })}</div>
                  <div>{KeyHtml({ key: 'KeyV', text: 'V' })}</div>
                  <div>{KeyHtml({ key: 'KeyB', text: 'B' })}</div>
                  <div>{KeyHtml({ key: 'KeyN', text: 'N' })}</div>
                  <div>{KeyHtml({ key: 'KeyM', text: 'M' })}</div>
                </div>  
              </div>
              <div className="bottom-middle"></div>
              <div className="bottom-right"></div>
            </div>
          </div>
          <div className="history"></div>
        </div>
      </div>
    </div>
  );
});
export default KeyboardSpace;
