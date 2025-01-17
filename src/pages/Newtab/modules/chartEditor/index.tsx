import React, { memo, useEffect, useState } from 'react';
import MyCodeEditor from '../code';
import EchartsPreview from './components/echartsPreview';
import { CONF } from './conf';

const ChartEditor = memo((props) => {
  const selectIt = (id: number) => {
    const deepChange = (arr: any[]) => {
      arr.forEach((ele) => {
        if (ele.id === id) {
          ele.select = !ele.select;
        }
        if (ele.child) {
          deepChange(ele.child);
        }
      });
      return arr;
    };
    setConfSelect(deepChange(JSON.parse(JSON.stringify(confSelect))));
  };
  const ConfSelect = (array: any[]) => {
    return array.map((ele) => (
      <div style={{ paddingLeft: '10px' }} key={ele.id}>
        {ele.type === 'p' ? <p>{ele.key}</p> : <></>}
        {ele.type === 'p' ? ConfSelect(ele.child) : ele.key}
        {ele.type !== 'p' ? (
          <i onClick={() => selectIt(ele.id)}>{ele.select ? '😝' : '😑'}</i>
        ) : (
          <></>
        )}
      </div>
    ));
  };
  const ConfOption = (array: any[]): any => {
    const childHasSelect = (
      arr: { select: any; type: string; child: any }[]
    ) => {
      let select = false;
      arr.forEach((ele: { select: any; type: string; child: any }) => {
        if (ele.select) {
          select = true;
          if (ele.type === 'p') {
            if (childHasSelect(ele.child)) {
              select = true;
            }
          }
        }
      });
      return select;
    };
    return array.map((ele, idx) => {
      return (
        <div style={{ paddingLeft: '10px' }} key={idx}>
          {ele.type === 'p' ? (
            <>
              {childHasSelect(ele.child) ? <p>{ele.key}</p> : <></>}
              {ConfOption(ele.child)}
            </>
          ) : ele.select ? (
            <div>
              {ele.key}:{ele.comp === 'input' ? <input></input> : <></>}
            </div>
          ) : (
            ''
          )}
        </div>
      );
    });
  };

  const [conf, setConf] = useState(CONF);
  const [confSelect, setConfSelect] = useState<any[]>([]);
  const [axisData, setAxisData] = useState<any>(
    `['Mon','Tue','Wed','Thu','Fri','Sat','Sun']`
  );
  // 图表配置
  const [options, setOptions] = useState({
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
      },
    ],
  });
  useEffect(() => {
    const _option = {
      ...options,
      xAxis: {
        ...options.xAxis,
        data: axisData.replace('[', '').replace(']', '').split(','),
      },
    };
    setOptions(_option);
  }, [axisData]);

  useEffect(() => {
    let id = 0;
    const deepLoop = (arr: any[]) => {
      arr.forEach((ele: any) => {
        ele.id = id;
        id++;
        ele.select = false;
        ele.value = '';
        if (ele.child) {
          deepLoop(ele.child);
        }
      });
      return arr;
    };
    setConfSelect(deepLoop(JSON.parse(JSON.stringify(conf))));
  }, [conf]);
  return (
    <div className="echarts-space">
      <div className="data-space">
        <MyCodeEditor
          code={Array.isArray(axisData) ? `[${axisData.join(',')}]` : axisData}
          codeChange={setAxisData}
        />
      </div>
      <div className="chart-preview-space">
        <EchartsPreview options={options} />
      </div>
      <div className="conf-space">
        {ConfOption(confSelect)}
        ----
        {ConfSelect(confSelect)}
      </div>
    </div>
  );
});
export default ChartEditor;
