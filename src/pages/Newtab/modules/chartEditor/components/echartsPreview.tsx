import * as echarts from 'echarts';
import React from 'react';
import { memo, useEffect, useRef, useState } from 'react';
const EChartsPreview = memo(({ options }: any) => {
  let chartInstance: echarts.ECharts | null = null;
  const chartRef = useRef<HTMLDivElement>(null);

  const [chart, setChart] = useState<any>();
  /** 初始化图表方法 */
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
  /** 图表初始化 & 尺寸监听 */
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
    if (chart && options) {
      chart.setOption(options);
    }
  }, [chart, options]);
  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
});

export default EChartsPreview;
