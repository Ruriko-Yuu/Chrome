import React, { memo, useEffect, useRef, useState } from 'react';
import { Lunar } from 'lunar-javascript';
import { sunRote, sunδ } from '../../../../../plugins/sun';
const PerpetualCalendar_Complex = memo<any>((props: any) => {
  const [content, setContet] = useState<{ [key: string]: any }>({});
  const [latLon, setLatLon] = useState<{ lat: any; lon: any }>({
    lat: null,
    lon: null,
  });
  const latLonRef = useRef(latLon);
  useEffect(() => {
    // 获取经纬度函数
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // 成功回调
            const latitude = position.coords.latitude; // 纬度
            const longitude = position.coords.longitude; // 经度
            console.log(`纬度: ${latitude}, 经度: ${longitude}`);
            setLatLon({
              lat: latitude,
              lon: longitude,
            });
            latLonRef.current = {
              lat: latitude,
              lon: longitude,
            };
            // 可选：将坐标传递给其他函数
            // useCoordinates(latitude, longitude);
          },
          (error) => {
            // 失败回调
            console.error('获取位置失败:', error.message);

            // 根据错误码处理
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert('用户拒绝了地理位置请求');
                break;
              case error.POSITION_UNAVAILABLE:
                alert('位置信息不可用');
                break;
              case error.TIMEOUT:
                alert('获取位置超时');
                break;
              default:
                alert('未知错误');
            }
          },
          {
            // 可选参数：提高精度或设置超时
            enableHighAccuracy: true, // 高精度模式（可能耗电）
            timeout: 10000, // 超时时间（毫秒）
            maximumAge: 0, // 不缓存位置
          }
        );
      } else {
        alert('您的浏览器不支持地理位置功能');
      }
    }
    // 调用函数
    getLocation();

    let timer: any;
    // 计算APM
    function gameLoop() {
      console.log(
        '时角',
        sunRote(latLonRef.current.lon),
        '赤纬',
        sunδ(new Date())
      );
      timer = requestAnimationFrame(gameLoop);
    }
    gameLoop();

    return () => {
      cancelAnimationFrame(timer);
    };
  }, []);
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
      <p>动物: {content.getAnimal}</p>
      <p>八字: {content.getBaZi?.join(' ')}</p>
      <p>八字纳音: {content.getBaZiNaYin?.join(' ')}</p>
      <p>八字十神天干: {content.getBaZiShiShenGan?.join(' ')}</p>
      <p>八字十神地支: {content.getBaZiShiShenZhi?.join(' ')}</p>
      <p>八字十神年柱: {content.getBaZiShiShenYearZhi?.join(' ')}</p>
      <p>八字十神月柱: {content.getBaZiShiShenMonthZhi?.join(' ')}</p>
      <p>八字十神日柱: {content.getBaZiShiShenDayZhi?.join(' ')}</p>
      <p>八字十神时柱: {content.getBaZiShiShenTimeZhi?.join(' ')}</p>
      <p>八字五行: {content.getBaZiWuXing?.join(' ')}</p>
      <p>
        冲: {content.getChong}
        {content.getChongDesc}
      </p>
      <p>宜：{content.getDayYi?.join('、')}</p>
      <p>忌：{content.getDayJi?.join('、')}</p>
      <p>吉神：{content.getDayJiShen?.join('、')}</p>
      <p>凶煞：{content.getDayXiongSha?.join('、')}</p>
      <p>
        彭祖百忌：{content.getPengZuGan} {content.getPengZuZhi}
      </p>
      <p>修颂：{content.getXiuSong}</p>
      <p>
        {latLon.lat} {latLon.lon}
      </p>
    </div>
  );
});
export default PerpetualCalendar_Complex;
