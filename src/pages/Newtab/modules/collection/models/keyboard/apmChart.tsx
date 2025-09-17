import * as echarts from 'echarts';
import React from 'react';
import { memo, useEffect, useRef, useState } from 'react';
const EChartsPreview = memo(({ apm }: any) => {
  let chartInstance: echarts.ECharts | null = null;
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<any>();
  const [apmList, setApmList] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    grid: {
      left: '10',
      right: '10',
      bottom: '10',
      top: '10',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'line',
      },
    ],
  });
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(chartRef.current);
      }
      if (chartInstance) {
        chartInstance.dispose(); // 组件卸载时销毁实例
        // eslint-disable-next-line react-hooks/exhaustive-deps
        chartInstance = null;
        setChart(undefined);
      }
    };
  }, []);

  useEffect(() => {
    const newTime = new Date().getTime();
    setApmList([...apmList, apm].filter((item) => newTime - item.time < 5000));
    if (chart) {
      chart.setOption({
        xAxis: {
          data: apmList.map((ele: any) => ''),
          axisTick: { show: false },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        yAxis: {
          show: false,
        },
        series: [
          {
            data: apmList.map((ele: { value: any }) => ele.value),
            symbol: 'circle',
            symbolSize: 0,
          },
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, apm]);
  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
});

export default EChartsPreview;
