import { Lunar } from 'lunar-javascript';
import React, { memo, useEffect, useState, useRef } from 'react';
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
  const [lunar, setLunar] = useState<any>({});
  const animationId: any = useRef(null);
  useEffect(() => {
    const animate = () => {
      const time = new Date();
      const second = time.getSeconds();
      const minute = time.getMinutes();
      const hour = time.getHours();
      if (dateObj.second !== (second < 10 ? `0${second}` : `${second}`)) {
        setDateObj({
          week: time.getDay(),
          month: time.getMonth() + 1,
          day: time.getDate(),
          hour: hour < 10 ? `0${hour}` : `${hour}`,
          minute: minute < 10 ? `0${minute}` : `${minute}`,
          second: second < 10 ? `0${second}` : `${second}`,
        });
        cancelAnimationFrame(animationId.current);
      }
      animationId.current = requestAnimationFrame(animate);
    };
    animationId.current = requestAnimationFrame(animate);
    // 清理函数
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = undefined;
      }
    };
  }, [dateObj.second]);

  useEffect(() => {
    const lunar = Lunar.fromDate(new Date());
    setLunar({
      string: lunar.toString(),
      yearInGanZhi: lunar.getYearInGanZhi(),
    });
  }, []);

  return (
    <li
      id="date-space"
      className="x-flex"
      style={{ gridColumn: 'span 2', gridRow: 'span 2', cursor: 'pointer' }}
      onClick={() => {
        props.dateBlockClick();
      }}
    >
      <p className="week">周{'x一二三四五六日'[dateObj.week]}</p>
      <p className="month--day">
        {dateObj.month}/{dateObj.day}
      </p>
      <p>
        {lunar.string}&nbsp;
        {lunar.yearInGanZhi}
      </p>
      <p className="hour--minute--second">
        {dateObj.hour}:{dateObj.minute}:{dateObj.second}
      </p>
    </li>
  );
});

export default Newtab;
