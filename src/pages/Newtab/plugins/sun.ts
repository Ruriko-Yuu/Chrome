export const sunRote = (lon: any, date = new Date()) => {
  const shicha = (lon - 120) / 15 / 60
  const sumTime = date.getHours() + date.getMinutes() / 60 + shicha
  const timeH = 15 * (sumTime - 12)
  if (lon) return timeH
}
// 太阳赤纬δ
export const sunδ = (date = new Date()) => {
  const now = date
  const start = new Date(now.getFullYear(), 0, 0); // 前一年的最后一天
  const diff = now.getTime() - start.getTime(); // 时间差（毫秒）
  const oneDay = 1000 * 60 * 60 * 24; // 一天的毫秒数
  const dayOfYear = Math.floor(diff / oneDay);
  return 23.44 * Math.sin((360 / 365) * (dayOfYear - 81))
}