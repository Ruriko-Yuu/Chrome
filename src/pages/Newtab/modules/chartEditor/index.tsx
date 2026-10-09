import React, { memo, useEffect, useState } from 'react';
import MyCodeEditor from '../code';
import EchartsPreview from './components/echartsPreview';
import { CONF } from './conf';

const CHART_TYPES = [
  { type: 'line', label: '折线图', tips: '用折线展示数据随类目的变化趋势' },
  { type: 'bar', label: '柱状图', tips: '用柱子高度对比各类目的数值大小' },
  { type: 'scatter', label: '散点图', tips: '用散点展示数值的分布情况' },
  { type: 'pie', label: '饼图', tips: '用扇形面积展示各类目的占比' },
];

const getValueAtPath = (obj: any, path: string[]) =>
  path.reduce((o, k) => (o == null ? undefined : o[k]), obj);

const ChartEditor = memo(() => {
  // 图表配置（唯一数据源）
  const [options, setOptions] = useState<any>({
    title: { text: '数据统计', left: 'center' },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
      },
    ],
  });
  const [conf, setConf] = useState(CONF);
  const [confSelect, setConfSelect] = useState<any[]>([]);

  useEffect(() => {
    let id = 0;
    const deepLoop = (arr: any[]) => {
      arr.forEach((ele: any) => {
        ele.id = id;
        id++;
        ele.select = false;
        if (ele.child) {
          deepLoop(ele.child);
        }
      });
      return arr;
    };
    setConfSelect(deepLoop(JSON.parse(JSON.stringify(conf))));
  }, [conf]);

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

  // 切换图表类型：按类型生成对应的完整图表配置，保留标题、系列名与数据
  const switchType = (type: string) => {
    setOptions((prev: any) => {
      const oldSeries = Array.isArray(prev.series) ? prev.series[0] ?? {} : {};
      const rawData: any[] = oldSeries.data ?? [];
      const categories =
        prev.xAxis?.data ?? rawData.map((v: any) => v?.name ?? '');
      const toPair = (v: any, i: number) =>
        v && typeof v === 'object' && 'value' in v
          ? v
          : { name: categories[i] ?? String(i), value: v };
      const toNum = (v: any) =>
        v && typeof v === 'object' && 'value' in v ? v.value : v;
      if (type === 'pie') {
        return {
          title: prev.title,
          tooltip: { trigger: 'item' },
          legend: { bottom: 0 },
          series: [
            {
              ...(oldSeries.name ? { name: oldSeries.name } : {}),
              type,
              radius: '60%',
              data: rawData.map(toPair),
            },
          ],
        };
      }
      return {
        title: prev.title,
        tooltip: { trigger: type === 'scatter' ? 'item' : 'axis' },
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'value' },
        series: [
          {
            ...(oldSeries.name ? { name: oldSeries.name } : {}),
            type,
            ...(type === 'line' ? { smooth: true } : {}),
            data: rawData.map(toNum),
          },
        ],
      };
    });
  };

  // 右侧面板修改单个配置项，不可变更新到对应路径（支持数组下标，如 series/0/data）
  const changeValue = (path: string[], value: any) => {
    setOptions((prev: any) => {
      const deepSet = (obj: any, idx: number): any => {
        if (idx === path.length) {
          return value;
        }
        const key = path[idx];
        if (Array.isArray(obj)) {
          const next = obj.slice();
          next[Number(key)] = deepSet(obj[Number(key)], idx + 1);
          return next;
        }
        return { ...obj, [key]: deepSet(obj?.[key], idx + 1) };
      };
      return deepSet(prev, 0);
    });
  };

  // 各配置项的兜底默认值（conf 中未声明 default 时按控件类型推断）
  const getDefault = (ele: any) => {
    if (ele.default !== undefined) {
      return ele.default;
    }
    const types: string[] = Array.isArray(ele.type) ? ele.type : [ele.type];
    if (ele.comp === 'switch' || types.includes('boolean')) {
      return true;
    }
    if (ele.comp === 'select') {
      return ele.options?.[0] ?? '';
    }
    if (ele.comp === 'color') {
      return '#333333';
    }
    if (types.includes('array')) {
      return [];
    }
    if (types.includes('number')) {
      return 1;
    }
    return '';
  };

  // 删除对应路径的配置，父级对象删空后一并移除
  const deleteValue = (path: string[]) => {
    const isEmpty = (v: any) =>
      v && typeof v === 'object'
        ? Array.isArray(v)
          ? v.length === 0
          : Object.keys(v).length === 0
        : false;
    setOptions((prev: any) => {
      const deepDel = (obj: any, idx: number): any => {
        if (obj == null || typeof obj !== 'object') {
          return obj;
        }
        const key = path[idx];
        const isLast = idx === path.length - 1;
        if (Array.isArray(obj)) {
          const next = obj.slice();
          if (isLast) {
            next.splice(Number(key), 1);
          } else {
            next[Number(key)] = deepDel(obj[Number(key)], idx + 1);
            if (isEmpty(next[Number(key)])) {
              next.splice(Number(key), 1);
            }
          }
          return next;
        }
        const next = { ...obj };
        if (isLast) {
          delete next[key];
        } else {
          next[key] = deepDel(obj[key], idx + 1);
          if (isEmpty(next[key])) {
            delete next[key];
          }
        }
        return next;
      };
      return deepDel(prev, 0);
    });
  };

  // 勾选配置项：若无值写入默认值；取消勾选：从配置中删除该项
  const toggleSelect = (ele: any, path: string[]) => {
    selectIt(ele.id);
    if (!ele.select) {
      if (getValueAtPath(options, path) === undefined) {
        changeValue(path, getDefault(ele));
      }
    } else {
      deleteValue(path);
    }
  };

  // 左侧代码块：实时解析 JSON 为图表配置，解析失败（编辑中）时保持原配置
  const optionsChange = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        setOptions(parsed);
      }
    } catch (e) {
      // JSON 尚未编辑完成，忽略
    }
  };

  const renderControl = (ele: any, path: string[]) => {
    const value = getValueAtPath(options, path);
    switch (ele.comp) {
      case 'switch':
        return (
          <input
            className="conf-control"
            type="checkbox"
            checked={!!value}
            onChange={(e) => changeValue(path, e.target.checked)}
          />
        );
      case 'select':
        return (
          <select
            className="conf-control"
            value={value ?? ''}
            onChange={(e) => changeValue(path, e.target.value)}
          >
            <option value=""></option>
            {(ele.options ?? []).map((o: string) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        );
      case 'color':
        return (
          <input
            className="conf-control color"
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value ?? '') ? value : '#000000'}
            onChange={(e) => changeValue(path, e.target.value)}
          />
        );
      default: {
        const types: string[] = Array.isArray(ele.type) ? ele.type : [ele.type];
        const isNumber = types.includes('number');
        const isArray = types.includes('array');
        if (isArray) {
          return (
            <input
              className="conf-control"
              value={JSON.stringify(value ?? '')}
              onChange={(e) => {
                try {
                  changeValue(path, JSON.parse(e.target.value));
                } catch (err) {
                  // 数组 JSON 编辑中，暂不写入
                }
              }}
            />
          );
        }
        return (
          <input
            className="conf-control"
            value={
              typeof value === 'object' && value !== null
                ? JSON.stringify(value)
                : (value ?? '')
            }
            onChange={(e) => {
              const raw = e.target.value;
              const numLike = raw !== '' && !isNaN(Number(raw));
              changeValue(path, isNumber && numLike ? Number(raw) : raw);
            }}
          />
        );
      }
    }
  };

  // 若该节点对应值在 options 中是数组（如 series），路径自动进入第一个元素
  const resolvePath = (path: string[]) => {
    const value = getValueAtPath(options, path);
    return Array.isArray(value) ? [...path, '0'] : path;
  };

  const ConfSelect = (
    array: any[],
    parentPath: string[] = [],
    depth = 0
  ): any => {
    return array.map((ele) => (
      <React.Fragment key={ele.id}>
        <div
          className="conf-select-row"
          style={{ paddingLeft: 8 + depth * 12 }}
          title={ele.tips}
          onClick={() =>
            ele.type !== 'p' &&
            toggleSelect(ele, [...parentPath, ...ele.key.split('.')])
          }
        >
          {ele.type === 'p' ? (
            <p className="conf-group">{ele.key}</p>
          ) : (
            <span className="conf-label">{ele.key}</span>
          )}
          {ele.type !== 'p' ? (
            <input
              className="conf-toggle"
              type="checkbox"
              checked={!!ele.select}
              readOnly
              tabIndex={-1}
            />
          ) : (
            <></>
          )}
        </div>
        {ele.type === 'p'
          ? ConfSelect(
              ele.child,
              resolvePath([...parentPath, ele.key]),
              depth + 1
            )
          : ''}
      </React.Fragment>
    ));
  };

  const childHasSelect = (arr: any[]): boolean => {
    return arr.some(
      (ele) =>
        ele.select || (ele.type === 'p' && childHasSelect(ele.child ?? []))
    );
  };

  const ConfOption = (
    array: any[],
    parentPath: string[] = [],
    depth = 0
  ): any => {
    return array.map((ele, idx) => {
      // 支持 'axisLine.show' 形式的点分路径
      const path = [...parentPath, ...ele.key.split('.')];
      return (
        <div key={idx}>
          {ele.type === 'p' ? (
            <>
              {childHasSelect(ele.child) && (
                <p
                  className="conf-group"
                  style={{ paddingLeft: 8 + depth * 12 }}
                  title={ele.tips}
                >
                  {ele.key}
                </p>
              )}
              {ConfOption(ele.child, resolvePath(path), depth + 1)}
            </>
          ) : ele.select ? (
            <div
              className="conf-option-row"
              style={{ paddingLeft: 8 + depth * 12 }}
              title={ele.tips}
            >
              <span className="conf-label">{ele.key}</span>
              {renderControl(ele, path)}
            </div>
          ) : (
            ''
          )}
        </div>
      );
    });
  };

  const currentType = getValueAtPath(options, ['series', '0', 'type']);

  return (
    <div className="echarts-space">
      <div className="data-space">
        <MyCodeEditor
          code={JSON.stringify(options, null, 2)}
          codeChange={optionsChange}
          height="100%"
        />
      </div>
      <div className="chart-preview-space">
        <div className="chart-type-bar">
          {CHART_TYPES.map((ct) => (
            <button
              key={ct.type}
              type="button"
              className={currentType === ct.type ? 'active' : ''}
              title={ct.tips}
              onClick={() => switchType(ct.type)}
            >
              {ct.label}
            </button>
          ))}
        </div>
        <div className="chart-preview-main">
          <EchartsPreview options={options} />
        </div>
      </div>
      <div className="conf-space">
        <div className="conf-edit-area">
          <div className="conf-editor">编辑区</div>
          {ConfOption(confSelect)}
        </div>
        <div className="conf-list-area">
          <div className="conf-editor">配置项（点击行勾选后加入编辑区）</div>
          {ConfSelect(confSelect)}
        </div>
      </div>
    </div>
  );
});
export default ChartEditor;
