import React, { useState, useEffect, useRef, memo } from 'react';
import dayjs from 'dayjs';
import './index.scss';
import EchartsPreview from './apmChart';
const KeyboardSpace = memo<any>((props: any) => {
  const [state, setState] = useState({ loadOver: true });
  const [keysState, setKeysState] = useState<any>({});
  const keysStateRef = useRef(keysState); // 用 ref 存储最新值
  const [keyHistory, setKeyHistory] = useState<any>([]);
  const keyHistoryRef = useRef(keyHistory); // 用 ref 存储最新值
  const [apm, setApm] = useState(0);
  const [time, setTime] = useState(0);
  const reset = () => {
    setKeysState({});
    setKeyHistory([]);
    keyHistoryRef.current = [];
  };
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
        event.preventDefault();
      }
      if (
        keyHistoryRef.current[keyHistoryRef.current.length - 1]?.code !==
        event.code
      ) {
        const keyCurrent = [
          ...keyHistoryRef.current,
          { code: event.code, time: new Date().getTime(), type: 'keyDown' },
        ];
        setKeyHistory(keyCurrent);
        keyHistoryRef.current = keyCurrent;
      }
      const currentState = { ...keysStateRef.current };
      if (currentState[event.code]) return; // 避免重复触发
      currentState[event.code] = true;
      setKeysState(currentState);
      keysStateRef.current = currentState;
      console.log(currentState);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const keyCurrent = [
        ...keyHistoryRef.current,
        { code: event.code, time: new Date().getTime(), type: 'keyUp' },
      ];
      setKeyHistory(keyCurrent);
      keyHistoryRef.current = keyCurrent;
      const currentState = { ...keysStateRef.current };
      currentState[event.code] = false;
      setKeysState(currentState);
      keysStateRef.current = currentState;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    let timer: any;
    // 计算APM
    function gameLoop() {
      let num = 0;
      let firstTime = 0;
      keyHistoryRef.current.forEach((ele: any) => {
        if (ele.type === 'keyDown') {
          if (firstTime === 0) {
            if (new Date().getTime() - ele.time < 5000) {
              firstTime = new Date().getTime() - ele.time;
            }
          }
          const time = new Date().getTime() - ele.time;
          if (time < 5000) {
            num++;
          }
        }
      });
      setApm(Math.floor((num / Math.max(firstTime, 1000)) * 1000 * 60 || 0));
      setTime(new Date().getTime());
      timer = requestAnimationFrame(gameLoop);
    }
    gameLoop();

    return () => {
      cancelAnimationFrame(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // 空依赖，只运行一次

  const KeyHtml = (conf: {
    key: string;
    text: string | Array<string>;
    width?: number;
    height?: string;
  }) => {
    const config = {
      width: 1,
      height: '50px',
      ...conf,
    };
    return (
      <div
        className={`key${keysState[config.key] === false ? ' pressed' : ''}${
          keysState[config.key] === true ? ' active' : ''
        }`}
        style={{ width: 50 * config.width + 'px', height: config.height }}
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
              <div className="top-middle">
                <div className="key-block">
                  <div>{KeyHtml({ key: 'Prtsc', text: 'Prtsc' })}</div>
                  <div>{KeyHtml({ key: 'Lock', text: 'Lock' })}</div>
                  <div>{KeyHtml({ key: 'Pause', text: 'Pause' })}</div>
                </div>
              </div>
              <div className="top-right"></div>
              <div className="bottom-left">
                <div className="key-block">
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
                  <div>
                    {KeyHtml({ key: 'Backspace', text: 'Backspace', width: 2 })}
                  </div>
                </div>
                <div className="key-block">
                  <div>{KeyHtml({ key: 'Tab', text: 'Tab', width: 1.5 })}</div>
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
                  <div>{KeyHtml({ key: 'BracketLeft', text: ['{', '['] })}</div>
                  <div>
                    {KeyHtml({ key: 'BracketRight', text: ['}', ']'] })}
                  </div>
                  <div>
                    {KeyHtml({
                      key: 'Backslash',
                      text: ['|', '\\'],
                      width: 1.5,
                    })}
                  </div>
                </div>
                <div className="key-block">
                  <div>
                    {KeyHtml({ key: 'CapsLock', text: 'Caps', width: 1.75 })}
                  </div>
                  <div>{KeyHtml({ key: 'KeyA', text: 'A' })}</div>
                  <div>{KeyHtml({ key: 'KeyS', text: 'S' })}</div>
                  <div>{KeyHtml({ key: 'KeyD', text: 'D' })}</div>
                  <div>{KeyHtml({ key: 'KeyF', text: 'F' })}</div>
                  <div>{KeyHtml({ key: 'KeyG', text: 'G' })}</div>
                  <div>{KeyHtml({ key: 'KeyH', text: 'H' })}</div>
                  <div>{KeyHtml({ key: 'KeyJ', text: 'J' })}</div>
                  <div>{KeyHtml({ key: 'KeyK', text: 'K' })}</div>
                  <div>{KeyHtml({ key: 'KeyL', text: 'L' })}</div>
                  <div>{KeyHtml({ key: 'Semicolon', text: [':', ';'] })}</div>
                  <div>{KeyHtml({ key: 'Quote', text: ['"', "'"] })}</div>
                  <div>
                    {KeyHtml({ key: 'Enter', text: 'Enter', width: 2.3 })}
                  </div>
                </div>
                <div className="key-block">
                  <div>
                    {KeyHtml({ key: 'ShiftLeft', text: 'Shift', width: 2.4 })}
                  </div>
                  <div>{KeyHtml({ key: 'KeyZ', text: 'Z' })}</div>
                  <div>{KeyHtml({ key: 'KeyX', text: 'X' })}</div>
                  <div>{KeyHtml({ key: 'KeyC', text: 'C' })}</div>
                  <div>{KeyHtml({ key: 'KeyV', text: 'V' })}</div>
                  <div>{KeyHtml({ key: 'KeyB', text: 'B' })}</div>
                  <div>{KeyHtml({ key: 'KeyN', text: 'N' })}</div>
                  <div>{KeyHtml({ key: 'KeyM', text: 'M' })}</div>
                  <div>{KeyHtml({ key: 'Comma', text: ['<', ','] })}</div>
                  <div>{KeyHtml({ key: 'Period', text: ['>', '.'] })}</div>
                  <div>{KeyHtml({ key: 'Slash', text: ['?', '/'] })}</div>
                  <div>
                    {KeyHtml({ key: 'ShiftRight', text: 'Shift', width: 2.7 })}
                  </div>
                </div>
                <div className="key-block">
                  <div>{KeyHtml({ key: 'ControlLeft', text: 'Ctrl' })}</div>
                  <div>{KeyHtml({ key: 'MetaLeft', text: 'Win' })}</div>
                  <div>{KeyHtml({ key: 'AltLeft', text: 'Alt' })}</div>
                  <div>{KeyHtml({ key: 'Space', text: '', width: 8.33 })}</div>
                  <div>{KeyHtml({ key: 'AltRight', text: 'Alt' })}</div>
                  <div>{KeyHtml({ key: 'MetaRight', text: 'Win' })}</div>
                  <div>{KeyHtml({ key: 'Menu', text: 'Menu' })}</div>
                  <div>{KeyHtml({ key: 'ControlRight', text: 'Ctrl' })}</div>
                </div>
              </div>
              <div className="bottom-middle">
                <div className="bottom-middle-top">
                  <div className="key-block">
                    <div>{KeyHtml({ key: 'Ins', text: 'Ins' })}</div>
                    <div>{KeyHtml({ key: 'Home', text: 'Home' })}</div>
                    <div>{KeyHtml({ key: 'Pgup', text: 'Pgup' })}</div>
                  </div>
                  <div className="key-block">
                    <div>{KeyHtml({ key: 'Del', text: 'Del' })}</div>
                    <div>{KeyHtml({ key: 'End', text: 'End' })}</div>
                    <div>{KeyHtml({ key: 'Pgdn', text: 'Pgdn' })}</div>
                  </div>
                </div>
                <div className="bottom-middle-bottom">
                  <div className="key-block"></div>
                  <div className="key-block">
                    <div>{KeyHtml({ key: 'ArrowUp', text: '↑' })}</div>
                  </div>
                  <div className="key-block">
                    <div>{KeyHtml({ key: 'ArrowLeft', text: '←' })}</div>
                    <div>{KeyHtml({ key: 'ArrowDown', text: '↓' })}</div>
                    <div>{KeyHtml({ key: 'ArrowRight', text: '→' })}</div>
                  </div>
                </div>
              </div>
              <div className="bottom-right">
                <div>{KeyHtml({ key: 'NumLock', text: ['Num', 'lock'] })}</div>
                <div>{KeyHtml({ key: '/', text: '/' })}</div>
                <div>{KeyHtml({ key: '*', text: '*' })}</div>
                <div>{KeyHtml({ key: '-', text: '-' })}</div>
                <div>{KeyHtml({ key: '7', text: '7' })}</div>
                <div>{KeyHtml({ key: '8', text: '8' })}</div>
                <div>{KeyHtml({ key: '9', text: '9' })}</div>
                <div style={{ gridArea: 'span 2 / span 1' }}>
                  {KeyHtml({ key: '+', text: '+', height: '100%' })}
                </div>
                <div>{KeyHtml({ key: '4', text: '4' })}</div>
                <div>{KeyHtml({ key: '5', text: '5' })}</div>
                <div>{KeyHtml({ key: '6', text: '6' })}</div>
                <div>{KeyHtml({ key: '1', text: '1' })}</div>
                <div>{KeyHtml({ key: '2', text: '2' })}</div>
                <div>{KeyHtml({ key: '3', text: '3' })}</div>
                <div style={{ gridArea: 'span 2 / span 1' }}>
                  {KeyHtml({ key: 'Enter', text: 'Enter', height: '100%' })}
                </div>
                <div style={{ gridArea: 'span 1 / span 2' }}>
                  {KeyHtml({ key: '0', text: '0', width: 2.06 })}
                </div>
                <div>{KeyHtml({ key: '.', text: '.' })}</div>
              </div>
            </div>
          </div>
          <div className="apm">
            <div className="apm--status">
              <div>
                <p>APM: {apm}</p>
                <p>实时每分钟触发次数</p>
              </div>
              <div className="status">
                <p className="active">
                  <i></i>
                  Active
                </p>
                <p className="presse">
                  <i></i>
                  Pressed
                </p>
                <p className="never">
                  <i></i>
                  Never
                </p>
              </div>
              <div onClick={reset} className="reset">
                重置
              </div>
            </div>
            <div style={{ width: '300px', height: '120px' }}>
              <EchartsPreview apm={{ value: apm, time: time }} />
            </div>
          </div>
          <div className="history">
            <div className="list">
              {keyHistory
                .slice(Math.max(keyHistory.length - 8, 0), keyHistory.length)
                .map((ele: { code: string; time: string; type: string }) => (
                  <p key={ele.time}>
                    {dayjs(ele.time).format('HH:mm:ss')}
                    <span>{ele.code}</span>
                    {ele.type}
                  </p>
                ))}
            </div>
            <p className="tips">
              由于浏览器API的限制，可能无法测试以下按键和某些快捷键
            </p>
            <span>Menu</span>
          </div>
        </div>
      </div>
    </div>
  );
});
export default KeyboardSpace;
