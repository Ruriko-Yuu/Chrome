import React, { useEffect, useState } from 'react';
import './index.scss';
const Newtab = () => {
  const [dateObj, setDateObj] = useState({
    week: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });
  useEffect(() => {
    const animate = () => {
      // 动画逻辑
      const time = new Date();
      setDateObj({
        week: time.getDay(),
        month: time.getMonth() + 1,
        day: time.getDate(),
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: time.getSeconds(),
      });
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <li className="x-flex" style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
      周{dateObj.week}
      <br />
      {dateObj.month}月{dateObj.day}日<br />
      {dateObj.hour}时{dateObj.minute}分{dateObj.second}秒
    </li>
  );
};

export default Newtab;
