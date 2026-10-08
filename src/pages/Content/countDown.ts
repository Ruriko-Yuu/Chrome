export const countDown = () => {
  requestAnimationFrame(countDown)
  const now = new Date()
  const remainder = ~~((new Date(`${now.getFullYear()} ${now.getMonth() + 1} ${now.getDate()} 17:00`).getTime() - new Date().getTime()) / 1000)
  if (document.getElementById('remainder')) {
    if (document.getElementById('remainder')!.innerHTML !== `${remainder}`) {
      document.getElementById('remainder')!.innerHTML = `${remainder}`
    }
  } else {
    var e = document.createElement("p");
    e.id = 'remainder'
    e.style.position = 'fixed'
    e.style.top = '0'
    e.style.right = '15px'
    e.style.zIndex = '9999999'
    e.style.color = '#6cf'
    e.style.backgroundColor = 'rgba(255,255,255,0.5)'
    e.innerHTML = `${remainder}`
    document.body.appendChild(e)
  }
}