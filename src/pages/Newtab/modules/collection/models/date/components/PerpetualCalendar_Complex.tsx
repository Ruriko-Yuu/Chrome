import React, { memo, useEffect, useState } from 'react';
import { Lunar } from 'lunar-javascript';

const PerpetualCalendar_Complex = memo<any>((props: any) => {
  const [content, setContet] = useState<{ [key: string]: any }>({});
  useEffect(() => {
    console.log();
    getContent(props.date);
  }, [props.date]);
  const getContent = (date: string | number | Date) => {
    if (date) {
      const lunar = Lunar.fromDate(new Date(date));
      const obj: { [key: string]: any } = {};
      for (const key in lunar) {
        if (Object.prototype.hasOwnProperty.call(lunar, key)) {
          try {
            const funResult =
              typeof (lunar as any)[key] === 'function'
                ? (lunar as any)[key]()
                : (lunar as any)[key];
            if (
              typeof funResult === 'object' &&
              !Array.isArray(funResult) &&
              funResult !== null
            ) {
              // ---
              for (const key2 in funResult) {
                if (Object.prototype.hasOwnProperty.call(funResult, key2)) {
                  try {
                    const funResult2 =
                      typeof (funResult as any)[key2] === 'function'
                        ? (funResult as any)[key2]()
                        : (funResult as any)[key2];
                    funResult[key2] = funResult2;
                  } catch (error) {}
                }
              }
              // ---
            }
            obj[key] = funResult;
          } catch (error) {}
        }
      }
      setContet(obj);
      console.log(date, obj);
    }
  };
  return (
    <div className="perpetual-calendar-calendar">
      <p>动物: { content.getAnimal }</p>
      <p>八字: { content.getBaZi?.join(' ') }</p>
      <p>八字纳音: { content.getBaZiNaYin?.join(' ') }</p>
      <p>八字十神天干: { content.getBaZiShiShenGan?.join(' ') }</p>
      <p>八字十神地支: { content.getBaZiShiShenZhi?.join(' ') }</p>
      <p>八字十神年柱: { content.getBaZiShiShenYearZhi?.join(' ') }</p>
      <p>八字十神月柱: { content.getBaZiShiShenMonthZhi?.join(' ') }</p>
      <p>八字十神日柱: { content.getBaZiShiShenDayZhi?.join(' ') }</p>
      <p>八字十神时柱: { content.getBaZiShiShenTimeZhi?.join(' ') }</p>
      <p>八字五行: { content.getBaZiWuXing?.join(' ') }</p>
      <p>冲: { content.getChong }{ content.getChongDesc }</p>
      <p>宜：{ content.getDayYi?.join('、') }</p>
      <p>忌：{ content.getDayJi?.join('、') }</p>
      <p>吉神：{ content.getDayJiShen?.join('、') }</p>
      <p>凶煞：{ content.getDayXiongSha?.join('、') }</p>
      <p>彭祖百忌：{content.getPengZuGan} {content.getPengZuZhi }</p>
      <p>：{content.getXiuSong}</p>
    </div>
  );
});
export default PerpetualCalendar_Complex;
