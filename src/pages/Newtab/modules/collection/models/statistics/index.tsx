import React, { useState, useEffect, useRef, memo } from 'react';
import './index.scss';
import ChartEditor from '../../../chartEditor'
const StatisticsSpace = memo<any>((props: any) => {
  const [state, setState] = useState({ loadOver: true });
  return (
    <div className="statistics-space">
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
        <ChartEditor />
      </div>
    </div>
  );
});
export default StatisticsSpace;
