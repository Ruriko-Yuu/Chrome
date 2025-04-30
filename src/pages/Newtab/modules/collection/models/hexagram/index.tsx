import React, { useState, useEffect, useRef, memo } from 'react';
import { GUA_OBJ, guaObjKeys } from './k';
// import DS from './ds'
import './index.scss';
const HexagramSpace = memo<any>((props: any) => {
  const [state, setState] = useState({ loadOver: true });
  const [hexagramResult, setHexagramResult] = useState<Array<string>>([]);
  const [gua, setGua] = useState<string>('');
  const [statistics, setStatistics] = useState<any>({});
  const blockTime = () => {
    const resultList = Array(3).fill(Math.random() > 0.5 ? 'o' : 'x');
    return ['⚋⨯', '⚋⁼', '⚊、', '⚊°'][
      resultList.filter((ele) => ele === 'o').length
    ];
  };
  const blockOne = () => {
    if (hexagramResult.length < 6) {
      setHexagramResult([...hexagramResult, blockTime()]);
    } else {
      setHexagramResult([blockTime()]);
    }
  };

  const blockSix = () => {
    setHexagramResult(
      Array(6)
        .fill('')
        .map(() => blockTime())
    );
  };
  useEffect(() => {
    if (hexagramResult.length === 6) {
      const hexagramResultSimple = hexagramResult
        .map((ele) => (ele === '⚊°' || ele === '⚊、' ? 'o' : 'x'))
        .join('') as guaObjKeys;
      const hexagramResultSimple2Gua = (hexagramResultSimple: guaObjKeys) => {
        return GUA_OBJ[hexagramResultSimple] || '';
      };
      setGua(hexagramResultSimple2Gua(hexagramResultSimple));
    } else {
      setGua('');
    }
  }, [hexagramResult]);

  useEffect(() => {
    if (gua) {
      const guaStatistics = statistics[gua] || 0;
      setStatistics({ ...statistics, [gua]: guaStatistics + 1 });
    }
  }, [gua]);
  return (
    <div className="hexagram-space">
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
        <div>
          <button onClick={blockOne}>掷一</button>
          <button onClick={blockSix}>掷六</button>
        </div>
        <div style={{ lineHeight: '3px' }}>
          {hexagramResult.map((ele, idx) => (
            <p key={idx}>{ele.replace(/[⨯⁼、°]/g, '')}</p>
          ))}
        </div>
        <div>{gua}</div>
        <div>统计{JSON.stringify(statistics)}</div>
        {/* <DS/> */}
      </div>
    </div>
  );
});
export default HexagramSpace;
