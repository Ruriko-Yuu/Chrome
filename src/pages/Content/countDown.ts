export const countDown = () => {
  requestAnimationFrame(countDown)
  const now = new Date()
  const nowTime = now.getTime()
  const endTime = new Date(`${now.getFullYear()} ${now.getMonth() + 1} ${now.getDate()} 17:00`).getTime()
  function formatCountdown(endTime, nowTime = Date.now()) {
    const diff = Math.max(0, endTime - nowTime); // 避免负数

    const hh = Math.floor(diff / 3600000);
    const mm = Math.floor((diff % 3600000) / 60000);
    const ss = Math.floor((diff % 60000) / 1000);
    const ms = diff % 1000;

    return (
      `${String(hh).padStart(2, '0')}:` +
      `${String(mm).padStart(2, '0')}:` +
      `${String(ss).padStart(2, '0')}.` +
      `${String(ms).padStart(3, '0')}`
    );
  }

  // 使用
  const remainder = formatCountdown(endTime, nowTime);
  if (document.getElementById('remainder')) {
    document.getElementById('remainder')!.innerHTML = `${remainder}`
  } else {
    var e = document.createElement("p");
    e.id = 'remainder'
    e.style.position = 'fixed'
    e.style.top = '0'
    e.style.right = '0'
    e.style.zIndex = '9999999'
    e.style.color = '#6cf'
    e.style.backgroundColor = 'rgba(255,255,255,0.5)'
    e.style.pointerEvents = 'none'
    e.style.fontFamily = 'amth'
    e.style.margin = '0'
    e.style.padding = '0 5px'
    e.innerHTML = `${remainder}`
    document.body.appendChild(e)
  }
}