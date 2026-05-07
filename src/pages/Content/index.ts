let doc: any = document;
let hidden = '';
let visibilityChange = '';
let titleSave = doc.title
if (typeof doc.hidden !== 'undefined') {
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof doc.mozHidden !== 'undefined') {
  hidden = 'mozHidden';
  visibilityChange = 'mozvisibilitychange';
} else if (typeof doc.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof doc.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}


document.addEventListener(
  visibilityChange,
  () => {
    if (doc[hidden]) {
      document.title = `(╯‵□′)╯︵┻━┻ ${titleSave}`;
    } else {
      document.title = '欢迎回来';
      setTimeout(() => {
        if (!doc[hidden]) {
          document.title = titleSave;
        }
      }, 3e3)
    }
  },
  false
);
// TODO: 🚀
function showLayout() {
  const CSS = `
    * {
      outline: 1px solid #6cf !important;
    }
    p,
    span,
    b,
    i {
      outline: 1px solid #c6f !important;
    }
    svg,
    path,
    img,
    canvas,
    ::before,
    ::after {
      outline: 1px solid #6fc !important;
    }
    *:hover {
      outline: 2px solid #fc6;
    }
  `;
  let new_element = document.createElement('style');
  new_element.setAttribute('type', 'text/css');
  new_element.setAttribute('id', 'ruriko-mark-dev');
  new_element.innerHTML = `${CSS}`;
  console.debug(new_element);
  document.body.appendChild(new_element);
}
function hiddenLayout() {
  let HTMLElement = document.getElementById('ruriko-mark-dev');
  if (HTMLElement !== null) {
    document.body.removeChild(HTMLElement);
  }
}

function hiddenXmlConsole() {
  document.getElementById('xmlConsole')!.className = 'off'
}
function showXmlConsole() {
  if (document.getElementById('xmlConsole') === null) {
    let new_element = document.createElement('style');
    new_element.setAttribute('type', 'text/css');
    new_element.setAttribute('id', 'xmlConsole');
    new_element.setAttribute('class', 'on');
    new_element.innerHTML = ``;
    document.body.appendChild(new_element);
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('injectedScript.bundle.js');
    document.head
      ? document.head.appendChild(s)
      : document.documentElement.appendChild(s);
  } else {
    console.log(document.getElementById('xmlConsole')!.className = 'on');
  }
}

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'shell') {
    switch (request.value) {
      case 'showLayout':
        showLayout();
        break;
      case 'hiddenLayout':
        hiddenLayout();
        break;
      case 'hiddenXmlConsole':
        hiddenXmlConsole();
        break;
      case 'showXmlConsole':
        showXmlConsole();
        break;
      case 'monitor':
        let obj: any = {};
        let win: any = window;
        for (let i in win.performance.memory) {
          obj[i] = win.performance.memory[i];
        }
        console.log(obj);
        sendResponse(obj);
        break;
      default:
        break;
    }
    sendResponse('');
    return true;
  }
});
(function () {
  let url: any;
  let arr = window.location.href.split('/');
  if (arr[2]) {
    url = arr[2];
  } else {
    url = null;
  }
  let obj = {};
  setInterval(() => {
    console.log('ypa!!!');
  }, 2e4);
  chrome.storage.sync.get({ show_layout: {} }, (v) => {
    console.log('扩展插件【Ruriko的工具箱】:storage show_layout', v);
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('injectedEchoScript.bundle.js');
    document.head
      ? document.head.appendChild(s)
      : document.documentElement.appendChild(s);
    if (v.show_layout[url] === 1) {
      showLayout();
    }
  });
  chrome.storage.sync.get({ show_xmlConsole: {} }, (v) => {
    console.log('扩展插件【Ruriko的工具箱】:storage show_xmlConsole', v);
    if (v.show_xmlConsole[url] === 1) {
      showXmlConsole();
    }
  });
  console.log('扩展插件【Ruriko的工具箱】:chrome', chrome);
  const storageDevMode = localStorage.getItem('show_layout');
  if (storageDevMode !== null) {
    obj = JSON.parse(storageDevMode);
  }
  const myBtn = () => {
    const container = document.getElementsByClassName('feed-roll-btn')
    console.log('container', container);
    if (container.length > 0) {
      // container[0].innerHTML = ''
      var e = document.createElement("button");
      e.innerHTML = '换一换';
      e.onclick = () => {
        console.log('mybtn clicked')
        fetch('https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd', {}).then((res) => {
          console.log(res.json().then(data => console.log(data.data.item)))
        }).catch(err => console.log(err))
      }
      container[0].appendChild(e)
    } else {
      setTimeout(() => {
        myBtn()
      }, 1e3);
    }
  }
  localStorage.setItem('gensokyo', 'ruriko');
  if (
    'https://www.bilibili.com/'.indexOf(window.location.href.split('?')[0]) !==
    -1
  ) {
    console.log(
      `%c换一换回退模块加载`,
      'color:white;background: #4386FE;padding: 3px 10px;border-radius: 3px'
    );
    myBtn()
  }

  if (~window.location.href.indexOf('ostsc.cn')) {
    window.onload = () => {
      const loopList = ['乳品类', '加工调理食品及其他类', '坚果及种子类', '水果类', '油脂类', '淀粉类', '糕饼点心类', '糖类', '肉类', '菇类', '蔬菜类', '藻类', '蛋类', '调味料及香辛料类', '谷物类', '豆类', '饮料类', '鱼贝类']
      const nowLoopIndex: any = localStorage.getItem('nowLoopIndex') || 0
      const nowLoopId: any = localStorage.getItem('nowLoopId') || 0
      if (window.location.pathname === '/category.php') {
        const theOne: any = document.getElementsByClassName('card-body')[0].children[0].children[nowLoopId % 20]
        if (!theOne || theOne.children[0].innerText === '该分类下暂无食品数据') {
          localStorage.setItem('nowLoopIndex', `${Number(nowLoopIndex) + 1}`)
          localStorage.setItem('nowLoopId', '0')
          window.location.href = `https://ostsc.cn/category.php?type=${loopList[Number(nowLoopIndex) + 1]}&page=1`
        } else {
          window.location.href = theOne.children[0].children?.[0]?.children?.[2]?.href || theOne.children[0].children[0].children[1].href
        }
      } else if (~window.location.pathname.indexOf('/static/food/')) {
        const ostsc = JSON.parse(localStorage.getItem('ostsc') || '{}')
        let length = 0
        for (const key in ostsc) {
          if (!Object.hasOwn(ostsc, key)) continue;
          length++
        }
        console.log('数据条数', length, '空间大小', (localStorage.getItem('ostsc') || '').length / (2 ** 10))
        let obj: any = { yy: {} }
        const card: any = document.getElementsByClassName('card')[0].children[0].children[0].children[0]
        obj.name = card.children[0].innerText
        const alias = card.children[1].innerText
        if (alias.indexOf('通用名称')) {
          obj.alias = alias.replace('通用名称：', '').split(',')
        }
        obj.type = card.children[2]?.children?.[1]?.innerText || card.children?.[1]?.children?.[1]?.innerText
        const warning: any = document.getElementsByClassName('alert-warning')[0]
        if (warning) {
          obj.warning = warning.children[1].innerText
        }
        const sp: any = document.getElementsByClassName('special-groups')[0]
        if (sp) {
          obj.sp = sp.children[1].innerText.split('\n')
        }
        const list: any = document.getElementsByClassName('table-responsive')[0].children[0].children[1].children
        for (let index = 0; index < list.length; index++) {
          obj['yy'][list[index].children[0].innerText] = {
            value: list[index].children[1].innerText.replace(',', ''),
            unit: list[index].children[2].innerText
          }
        }
        const price: any = document.getElementsByClassName('card')[2].children[1].children[1].children
        let priceList = []
        for (let i = 0; i < price.length; i++) {
          priceList.push({
            type: ~price[i].children[0].className.indexOf('text-success') ? 'good' : 'bad',
            text: price[i].innerText
          })
        }
        obj.price = priceList
        localStorage.setItem('ostsc', JSON.stringify({ ...ostsc, [obj.name]: obj }))
        localStorage.setItem('nowLoopId', `${Number(nowLoopId) + 1}`)
        window.location.href = `https://ostsc.cn/category.php?type=${loopList[nowLoopIndex]}&page=${Math.max(1, Math.ceil((Number(nowLoopId) + 1) / 20))}`
      } else {
        window.location.href = `https://ostsc.cn/category.php?type=${loopList[nowLoopIndex]}&page=${Math.max(1, Math.ceil(nowLoopId / 20))}`
      }

    }
  }

  const countDown = () => {
    requestAnimationFrame(countDown)
    const now = new Date()
    const remainder = ~~((new Date(`${now.getFullYear()} ${now.getMonth() + 1} ${now.getDate()} 17:30`).getTime() - new Date().getTime()) / 1000)
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
  countDown()

  chrome.storage.sync.get({ statistics: {} }, (v) => {
    console.log('扩展插件【Ruriko的工具箱】:storage', v);
    // chrome.storage.sync.set({ show_layout: v.show_layout }, () => {
    //   console.log('赋值成功');
    // });
  });
  console.log('目标https://www.nutridata.cn/database/ingredient/1?date=1757997668753&typer=search&baseId=1', window.location.href);
})();

(function () {
  let bugTimer = null
  // 只针对目标网站执行
  if (!window.location.hostname.includes('antchensw.cn')) {
    console.info('⚠️ 当前网站不是目标网站，工具箱停止执行');
    return;
  }
  console.info('🪳杀手已加载');

  // 从 localStorage 读取上次的状态，默认为 false（关闭）
  const getStoredEnabled = (key, defaultValue = false) => {
    const stored = localStorage.getItem(key);
    return stored === 'true' ? true : (stored === 'false' ? false : defaultValue);
  };

  // 保存状态到 localStorage
  const saveEnabled = (key, value) => {
    localStorage.setItem(key, value);
  };

  // 全局控制标志 - 从存储中读取
  let isBugKillerEnabled = getStoredEnabled('ruriko-bug-killer-enabled', false);
  let isSpecialDishEnabled = getStoredEnabled('ruriko-special-dish-enabled', false);
  let isPanelCollapsed = getStoredEnabled('ruriko-panel-collapsed', true); // 默认收缩
  let timeoutId = null;

  // 路由器模拟/覆盖
  const router = { push: (url) => { } };
  router.push = (url) => {
    console.info('📍 跳转页面:', url);
    window.location.href = 'http://antchensw.cn' + url;
  };

  // 四分钟抓取逻辑
  const fourMinGetBugList = () => {
    if (!isBugKillerEnabled) return;
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    if (minutes % 4 === 1 && (seconds === 2 || seconds === 5 || seconds === 7)) {
      console.info(`⏰ 时间条件满足 (分钟:${minutes}, 秒:${seconds})，执行重定向到朋友页面`);
      router.push('/friend?p=1&t=5&w=');
    } else {
      console.info(`⏰ 时间条件不满足 (分钟:${minutes}, 秒:${seconds})，继续检查蟑螂选项`);
    }
  };

  // 特色菜制作逻辑
  const handleSpecialDish = () => {
    if (!isSpecialDishEnabled) return false;

    if (window.location.href.indexOf('/rest/cookbooks?cook=2') !== -1) {
      const daoList: any = document.getElementsByClassName('nav-item text-center');
      const daoIndex = 1;
      if (daoList.length) {
        if (daoList[daoIndex].innerHTML.indexOf('active') !== -1) {
          const decodeHtmlEntities = (str) => {
            if (!str) return '';
            const textarea = document.createElement('textarea');
            textarea.innerHTML = str;
            return textarea.value;
          };

          const getWeatherInfo = () => {
            const weatherElement = document.getElementsByTagName('a')[1];
            if (!weatherElement) return null;
            const rawTitle = weatherElement.getAttribute('data-bs-title');
            if (!rawTitle) return null;
            const decodedTitle = decodeHtmlEntities(rawTitle);
            const weatherMatch = decodedTitle.match(/<h6[^>]*>(.*?)<\/h6>/);
            const weatherName = weatherMatch ? weatherMatch[1] : '未知天气';
            return { weatherName };
          };

          const weatherInfo = getWeatherInfo();
          if (!weatherInfo) return false;

          console.log("获取天气，准备做特色菜，当前天气：", weatherInfo.weatherName);
          const fieldset: any = document.getElementsByTagName('fieldset')
          const notHaveC = fieldset[0]?.childNodes[0]?.innerHTML?.indexOf('请在下方选择要烹制的特色菜') !== -1;

          if (notHaveC) {
            let caiIndex = 0;
            (document.getElementById('mysteriousCookbooksContent') as any)?.childNodes[caiIndex]?.childNodes[1]?.childNodes[2]?.click();
          } else {
            if (fieldset[0]?.childNodes[3]?.innerHTML && fieldset[0]?.childNodes[3]?.innerHTML?.indexOf('剩余份数') !== -1) {
              console.log('还有剩余特色菜');
            } else {
              if (weatherInfo.weatherName.indexOf('雾') !== -1) {
                fieldset[0]?.childNodes[0]?.childNodes[3]?.childNodes[1]?.childNodes[0]?.click();
              }
              setTimeout(() => {
                fieldset[0]?.childNodes[0]?.childNodes[4]?.childNodes[1]?.click();
              }, 200);
            }
          }
          return true;
        } else {
          daoList[daoIndex].childNodes[0].click();
          return true;
        }
      }
    }
    return false;
  };

  // 主要逻辑
  const runMainLogic = () => {
    // 特色菜逻辑（独立于打蟑螂开关）
    handleSpecialDish();

    if (!isBugKillerEnabled) {
      return;
    }

    fourMinGetBugList();
    // 情况1: 匹配页面 - friend页面
    if (window.location.href.indexOf('http://antchensw.cn/friend?') !== -1) {
      console.info('📍 当前在朋友列表页面，开始检查时间条件和蟑螂选项');

      const cockroachRadio: any = document.querySelector('input[type="radio"][value="蟑螂"]')
        || Array.from(document.querySelectorAll('input[type="radio"]')).find(radio => {
          const label: any = document.querySelector(`label[for="${radio.id}"]`);
          return label ? label.innerText.includes('蟑螂') : false;
        });

      if (cockroachRadio) {
        console.info('✅ 找到蟑螂选项:', cockroachRadio);

        if (cockroachRadio.checked) {
          console.info('🪳 蟑螂选项已选中，查找bi-bug元素');
          const roundedPill: any = document.getElementsByClassName('bi-bug');

          if (roundedPill.length) {
            const indexVal = 0;
            const url = roundedPill[indexVal].parentElement.parentElement.href.replace('http://antchensw.cn', '');
            router.push(url);
          } else {
            console.info('❌ 未找到bi-bug元素，无法跳转, 去看看还有没有菜');
            router.push('/rest');
          }
        } else {
          console.info('🪳 蟑螂选项未选中，正在执行自动点击');
          cockroachRadio.click();
          cockroachRadio.dispatchEvent(new Event('change', { bubbles: true }));
          console.info('✅ 已自动切换到蟑螂选项');
        }
      }
    }
    // 情况2: 详情页面 - friend/info页面
    else if (window.location.href.indexOf('http://antchensw.cn/friend/info?') !== -1) {
      console.info('到达好友餐厅');

      const bug = document.getElementsByClassName('bi-bug');
      if (bug.length) {
        console.info('🎉到达好友餐厅,发现蟑螂');
        let bugNum = 0;
        let bugFloor = false;

        for (let i = 0; i < bug.length; i++) {
          const tagName = bug[i].parentElement.tagName;
          const isMyBug = bug[i].className.indexOf('text-success') !== -1;
          if (tagName === 'SPAN') {
            const haveBugFloor = bug[i].parentElement.parentElement;
            if (haveBugFloor.className.indexOf('active') === -1 && !bugFloor) {
              console.info('当前未在有蟑螂的楼层,正在前往该楼层');
              haveBugFloor.click();
              return;
            } else {
              console.info('当前已在有蟑螂的楼层');
              bugFloor = true;
            }
          } else if (tagName === 'A' && !isMyBug) {
            if (bug[i].parentElement.innerHTML.indexOf('bi-shield-exclamation') !== -1) {
              console.info('🪳 发现蟑螂，正在点击');
              if (bugTimer) {
                clearInterval(bugTimer);
              }
              bugTimer = setInterval(() => {
                if (document.body.innerHTML.indexOf('该桌') !== -1) {
                  console.info('🎯蟑螂已被打，跳转到朋友列表页');
                  router.push('/friend?p=1&t=5&w=');
                }
              }, 50);
              bug[i].parentElement.click();
              bugNum++;
            }
          }
        }
        if (bugNum === 0) {
          const floor = document.getElementsByClassName('goodslevel');
          if (floor.length) {
            console.info('🎯楼层加载 ~ 没有蟑螂，跳转到朋友列表页');
            router.push('/friend?p=1&t=5&w=');
          }
        }
      } else {
        const floor = document.getElementsByClassName('goodslevel');
        if (floor.length) {
          router.push('/friend?p=1&t=5&w=');
        }
      }
    }
    // 情况3: 首页
    else if (window.location.href === 'http://antchensw.cn/rest') {
      const floatEndList = document.getElementsByClassName('float-end');
      let foodNot = false;
      for (let index = 0; index < floatEndList.length; index++) {
        const element = floatEndList[index];
        if (element.innerHTML.indexOf('去烹制') !== -1) {
          foodNot = true;
        }
      }
      if (foodNot) {
        router.push('/rest/cookbooks?cook=2');
      }
    }
  };

  // 循环执行
  const loop = () => {
    runMainLogic();
    timeoutId = setTimeout(loop, ~~(Math.random() * 100) + 1000);
  };

  // 更新控制面板UI
  const updatePanelUI = () => {
    const bugStatusText = document.getElementById('ruriko-bug-status');
    const bugToggleBtn = document.getElementById('ruriko-bug-toggle');
    const dishStatusText = document.getElementById('ruriko-dish-status');
    const dishToggleBtn = document.getElementById('ruriko-dish-toggle');
    const collapseBtn = document.getElementById('ruriko-collapse-btn');
    const panelContent = document.getElementById('ruriko-panel-content');

    if (bugStatusText && bugToggleBtn) {
      if (isBugKillerEnabled) {
        bugStatusText.innerText = '🐛 开启';
        bugStatusText.style.color = '#6bff6b';
        bugToggleBtn.innerText = '关闭';
        bugToggleBtn.style.background = '#6b6bff';
      } else {
        bugStatusText.innerText = '🐛 关闭';
        bugStatusText.style.color = '#ff6b6b';
        bugToggleBtn.innerText = '开启';
        bugToggleBtn.style.background = '#ff6b6b';
      }
    }

    if (dishStatusText && dishToggleBtn) {
      if (isSpecialDishEnabled) {
        dishStatusText.innerText = '🍳 开启';
        dishStatusText.style.color = '#6bff6b';
        dishToggleBtn.innerText = '关闭';
        dishToggleBtn.style.background = '#6b6bff';
      } else {
        dishStatusText.innerText = '🍳 关闭';
        dishStatusText.style.color = '#ff6b6b';
        dishToggleBtn.innerText = '开启';
        dishToggleBtn.style.background = '#ff6b6b';
      }
    }

    if (panelContent && collapseBtn) {
      if (isPanelCollapsed) {
        panelContent.style.display = 'none';
        collapseBtn.innerHTML = '▶';
      } else {
        panelContent.style.display = 'flex';
        collapseBtn.innerHTML = '▼';
      }
    }
  };

  // 创建控制面板UI
  const createControlPanel = () => {
    if (document.getElementById('ruriko-control-panel')) {
      updatePanelUI();
      return;
    }

    const panel = document.createElement('div');
    panel.id = 'ruriko-control-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      background: #1e1e2f;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      font-family: system-ui, -apple-system, 'Segoe UI', monospace;
      font-size: 13px;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.2);
      min-width: 180px;
    `;

    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = `
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      user-select: none;
    `;

    const titleSpan = document.createElement('span');
    titleSpan.innerText = '🎮 工具箱';
    titleSpan.style.cssText = `
      color: white;
      font-weight: bold;
      font-size: 12px;
    `;

    const collapseBtn = document.createElement('button');
    collapseBtn.id = 'ruriko-collapse-btn';
    collapseBtn.innerHTML = '▼';
    collapseBtn.style.cssText = `
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 12px;
      padding: 0 4px;
      transition: transform 0.2s;
    `;

    const contentDiv = document.createElement('div');
    contentDiv.id = 'ruriko-panel-content';
    contentDiv.style.cssText = `
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;

    // 打蟑螂开关行
    const bugRow = document.createElement('div');
    bugRow.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    `;
    const bugStatus = document.createElement('span');
    bugStatus.id = 'ruriko-bug-status';
    bugStatus.style.cssText = `font-weight: bold;`;
    const bugToggle = document.createElement('button');
    bugToggle.id = 'ruriko-bug-toggle';
    bugToggle.style.cssText = `
      background: #ff6b6b;
      border: none;
      color: white;
      padding: 4px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
    `;

    // 特色菜开关行
    const dishRow = document.createElement('div');
    dishRow.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    `;
    const dishStatus = document.createElement('span');
    dishStatus.id = 'ruriko-dish-status';
    dishStatus.style.cssText = `font-weight: bold;`;
    const dishToggle = document.createElement('button');
    dishToggle.id = 'ruriko-dish-toggle';
    dishToggle.style.cssText = `
      background: #ff6b6b;
      border: none;
      color: white;
      padding: 4px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
    `;

    bugRow.appendChild(bugStatus);
    bugRow.appendChild(bugToggle);
    dishRow.appendChild(dishStatus);
    dishRow.appendChild(dishToggle);
    contentDiv.appendChild(bugRow);
    contentDiv.appendChild(dishRow);

    headerDiv.appendChild(titleSpan);
    headerDiv.appendChild(collapseBtn);
    panel.appendChild(headerDiv);
    panel.appendChild(contentDiv);
    document.body.appendChild(panel);

    // 事件绑定
    headerDiv.onclick = (e) => {
      if (e.target !== collapseBtn && e.target !== headerDiv) return;
      isPanelCollapsed = !isPanelCollapsed;
      saveEnabled('ruriko-panel-collapsed', isPanelCollapsed);
      updatePanelUI();
    };

    bugToggle.onclick = (e) => {
      e.stopPropagation();
      isBugKillerEnabled = !isBugKillerEnabled;
      saveEnabled('ruriko-bug-killer-enabled', isBugKillerEnabled);
      updatePanelUI();
      console.info(isBugKillerEnabled ? '🚀 打蟑螂已开启' : '⏸️ 打蟑螂已关闭');
    };

    dishToggle.onclick = (e) => {
      e.stopPropagation();
      isSpecialDishEnabled = !isSpecialDishEnabled;
      saveEnabled('ruriko-special-dish-enabled', isSpecialDishEnabled);
      updatePanelUI();
      console.info(isSpecialDishEnabled ? '🍳 自动特色菜已开启' : '🍳 自动特色菜已关闭');
    };

    // 鼠标悬浮效果
    [bugToggle, dishToggle].forEach(btn => {
      btn.onmouseenter = () => { btn.style.transform = 'scale(1.02)'; };
      btn.onmouseleave = () => { btn.style.transform = 'scale(1)'; };
    });

    updatePanelUI();
  };

  // 启动
  const start = () => {
    createControlPanel();
    loop();
    console.info(`🎮 控制面板已添加`);
    console.info(`🐛 打蟑螂状态：${isBugKillerEnabled ? '开启' : '关闭'}`);
    console.info(`🍳 自动特色菜状态：${isSpecialDishEnabled ? '开启' : '关闭'}`);
    console.info(`📁 面板默认收缩，点击标题栏可展开/收起`);
  };

  start();
})();