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
    <div className="perpetual-calendar-complex">
      {/* 基本信息卡片 */}
      <div className="info-card basic-info">
        <div className="card-header">
          <span className="icon">🐾</span>
          <h3>生肖与八字</h3>
        </div>
        <div className="card-content">
          <div className="info-row">
            <span className="label">生肖：</span>
            <span className="value animal">{content.getAnimal}</span>
          </div>
          <div className="info-row">
            <span className="label">八字：</span>
            <span className="value bazi">{content.getBaZi?.join(' ')}</span>
          </div>
          <div className="info-row">
            <span className="label">纳音：</span>
            <span className="value">{content.getBaZiNaYin?.join(' ')}</span>
          </div>
          <div className="info-row">
            <span className="label">五行：</span>
            <span className="value wuxing">{content.getBaZiWuXing?.join(' ')}</span>
          </div>
        </div>
      </div>

      {/* 宜忌卡片 */}
      <div className="info-card yiji-card">
        <div className="card-header">
          <span className="icon">✨</span>
          <h3>今日宜忌</h3>
        </div>
        <div className="card-content">
          <div className="info-section yi">
            <div className="section-title">
              <span className="badge good">宜</span>
            </div>
            <p className="section-content">{content.getDayYi?.join('、') || '无'}</p>
          </div>
          <div className="info-section ji">
            <div className="section-title">
              <span className="badge bad">忌</span>
            </div>
            <p className="section-content">{content.getDayJi?.join('、') || '无'}</p>
          </div>
        </div>
      </div>

      {/* 神煞卡片 */}
      <div className="info-card shensha-card">
        <div className="card-header">
          <span className="icon">🌟</span>
          <h3>吉神凶煞</h3>
        </div>
        <div className="card-content">
          <div className="info-section">
            <div className="section-title">
              <span className="badge good">吉神</span>
            </div>
            <p className="section-content">{content.getDayJiShen?.join('、') || '无'}</p>
          </div>
          <div className="info-section">
            <div className="section-title">
              <span className="badge bad">凶煞</span>
            </div>
            <p className="section-content">{content.getDayXiongSha?.join('、') || '无'}</p>
          </div>
        </div>
      </div>

      {/* 冲煞与彭祖百忌 */}
      <div className="info-card chongsha-card">
        <div className="card-header">
          <span className="icon">⚡</span>
          <h3>冲煞与禁忌</h3>
        </div>
        <div className="card-content">
          <div className="info-row">
            <span className="label">冲：</span>
            <span className="value">{content.getChong} {content.getChongDesc}</span>
          </div>
          <div className="info-row pengzu">
            <span className="label">彭祖百忌：</span>
            <span className="value">{content.getPengZuGan} {content.getPengZuZhi}</span>
          </div>
        </div>
      </div>

      {/* 十神信息（可折叠） */}
      <details className="info-card collapsible">
        <summary className="card-header">
          <span className="icon">🔮</span>
          <h3>十神详解</h3>
        </summary>
        <div className="card-content">
          <div className="info-row">
            <span className="label">天干：</span>
            <span className="value">{content.getBaZiShiShenGan?.join(' ')}</span>
          </div>
          <div className="info-row">
            <span className="label">地支：</span>
            <span className="value">{content.getBaZiShiShenZhi?.join(' ')}</span>
          </div>
          <div className="info-row">
            <span className="label">年柱：</span>
            <span className="value">{content.getBaZiShiShenYearZhi?.join(' ')}</span>
          </div>
          <div className="info-row">
            <span className="label">月柱：</span>
            <span className="value">{content.getBaZiShiShenMonthZhi?.join(' ')}</span>
          </div>
          <div className="info-row">
            <span className="label">日柱：</span>
            <span className="value">{content.getBaZiShiShenDayZhi?.join(' ')}</span>
          </div>
          <div className="info-row">
            <span className="label">时柱：</span>
            <span className="value">{content.getBaZiShiShenTimeZhi?.join(' ')}</span>
          </div>
        </div>
      </details>

      {/* 其他信息 */}
      <div className="info-card other-info">
        <div className="card-header">
          <span className="icon">📿</span>
          <h3>其他信息</h3>
        </div>
        <div className="card-content">
          <div className="info-row">
            <span className="label">二十八宿：</span>
            <span className="value">{content.getXiuSong}</span>
          </div>
          {latLon.lat && latLon.lon && (
            <div className="info-row location">
              <span className="label">📍 位置：</span>
              <span className="value">{latLon.lat.toFixed(4)}°, {latLon.lon.toFixed(4)}°</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
export default PerpetualCalendar_Complex;
