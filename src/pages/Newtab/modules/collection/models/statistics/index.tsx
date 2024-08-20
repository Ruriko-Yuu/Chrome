import React, { useState, useEffect, useRef, memo } from 'react';
import './index.scss';
import * as echarts from 'echarts';
const EchartSpace = memo((props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [axisData, setAxisData] = useState<any>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ]);
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
  let chartInstance: echarts.ECharts | null = null;
  const [chart, setChart] = useState<any>();
  const initChart = () => {
    if (
      !chartRef.current ||
      !chartRef.current.clientWidth ||
      !chartRef.current.clientHeight
    ) {
      console.warn('无法获取图表容器的尺寸！');
      return;
    }
    // 销毁之前的实例
    if (chartInstance) {
      chartInstance.dispose();
    }
    chartInstance = echarts.init(chartRef.current);
    setChart(chartInstance);
    chartInstance.setOption(options);
  };
  useEffect(() => {
    initChart();
    // 监听图表容器尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      if (chartInstance) {
        chartInstance.resize();
      }
    });
    // 监听图表容器尺寸变化
    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }
    return () => {
      if (resizeObserver && chartRef.current) {
        resizeObserver.unobserve(chartRef.current);
      }
      if (chartInstance) {
        chartInstance.dispose(); // 组件卸载时销毁实例
        chartInstance = null;
        setChart(undefined);
      }
    };
  }, []);
  useEffect(() => {
    setOptions({
      ...options,
      xAxis: {
        ...options.xAxis,
        data: Array.isArray(axisData)
          ? axisData
          : axisData.replace('[', '').replace(']', '').split(','),
      },
    });
    if (chart) {
      chart.setOption(options);
    }
  }, [axisData]);
  return (
    <div className="echarts-space">
      <div className="data-space">
        <textarea
          onBlur={(e) => {
            setAxisData(e.target.value as any);
          }}
          defaultValue={
            Array.isArray(axisData) ? `[${axisData.join(',')}]` : axisData
          }
        />
      </div>
      <div className="chart-preview-space" ref={chartRef}></div>
      <div className="conf-space">1</div>
    </div>
  );
});
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
        <EchartSpace />
      </div>
    </div>
  );
});
export default StatisticsSpace;
