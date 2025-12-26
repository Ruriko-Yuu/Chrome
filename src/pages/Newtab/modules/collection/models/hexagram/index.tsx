import React, { memo, useState, useEffect } from 'react';
import { GUA_OBJ, guaObjKeys } from './k';
import './index.scss';
const HexagramSpace = memo<any>((props: any) => {
  const [state, setState] = useState({ loadOver: true });
  const [coinList, setCoinList] = useState<number[]>([]);
  const [yao, setYao] = useState<string[]>([]);
  const [gua, setGua] = useState<string[]>([]);
  const doCoin = () => {
    return Math.random() > 0.5 ? 1 : 0;
  };

  const doOne = () => {
    if (coinList.length < 18) {
      setCoinList([...new Array(3).fill(0).map(doCoin), ...coinList]);
    } else {
      setCoinList([...new Array(3).fill(0).map(doCoin)]);
    }
  };
  useEffect(() => {
    function groupCoinsByThree(coinList: number[]) {
      const groups = [];
      for (let i = 0; i < coinList.length; i += 3) {
        groups.push(coinList.slice(i, i + 3));
      }
      return groups;
    }
    const iYao = groupCoinsByThree(coinList).map(
      (ele) => `${ele.join('').replace(/0/g, '').length}`
    );
    setYao(iYao);
    const iGuaA: guaObjKeys = iYao
      .map((ele) => {
        return {
          '0': 'x',
          '1': 'x',
          '2': 'o',
          '3': 'o',
        }[ele];
      })
      .join('') as guaObjKeys;
    const iGuaB: guaObjKeys = iYao
      .map((ele) => {
        return {
          '0': 'o',
          '1': 'x',
          '2': 'o',
          '3': 'x',
        }[ele];
      })
      .join('') as guaObjKeys;
    setGua([GUA_OBJ[iGuaA]?.name, GUA_OBJ[iGuaB]?.name]);
  }, [coinList]);
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
        <div onClick={doOne}>起一</div>
        {[...coinList].reverse().map((ele) => (ele ? '正' : '反'))}
        <br></br>
        <div style={{ display: 'flex' }}>
          <div>
            起卦（得本卦）
            {gua[0]}
          </div>
          <div>
            起卦（得之卦）
            {gua[1]}
          </div>
        </div>
      </div>
    </div>
  );
});
export default HexagramSpace;
