import React, { memo, useEffect, useState } from 'react';
import { Lunar } from 'lunar-javascript';
import './index.scss';

const Newtab = memo<any>((props: any) => {
  const [dateObj, setDateObj] = useState({
    week: 0,
    month: 0,
    day: 0,
    hour: '',
    minute: '',
    second: '',
  });
  const [lunar, setLunar] = useState<any>(Lunar.fromDate(new Date()));
  useEffect(() => {
    const animate = () => {
      // 动画逻辑
      const time = new Date();
      setDateObj({
        week: time.getDay(),
        month: time.getMonth() + 1,
        day: time.getDate(),
        hour:
          time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`,
        minute:
          time.getMinutes() < 10
            ? `0${time.getMinutes()}`
            : `${time.getMinutes()}`,
        second:
          time.getSeconds() < 10
            ? `0${time.getSeconds()}`
            : `${time.getSeconds()}`,
      });
      requestAnimationFrame(animate);
    };

    // 获取当前农历日期
    setLunar(Lunar.fromDate(new Date()));
    requestAnimationFrame(animate);
  }, []);

  return (
    <li
      id="date-space"
      className="x-flex"
      style={{ gridColumn: 'span 2', gridRow: 'span 2' }}
      onClick={() => {
        props.dateBlockClick();
      }}
    >
      <p className="week">周{'x一二三四五六日'[dateObj.week]}</p>
      <p className="month--day">
        {dateObj.month}/{dateObj.day}
      </p>
      <p>
        {lunar.toString()}&nbsp;
        {lunar.getYearInGanZhi()}
      </p>
      <p className="hour--minute--second">
        {dateObj.hour}:{dateObj.minute}:{dateObj.second}
      </p>
    </li>
  );
});

export default Newtab;
