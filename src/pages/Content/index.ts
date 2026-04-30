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
  // 只针对目标网站执行
  if (!window.location.hostname.includes('antchensw.cn')) {
    console.info('⚠️ 当前网站不是目标网站，工具箱停止执行');
    return;
  }
  console.info('🪳杀手已加载');

  // 从 localStorage 读取上次的状态，默认为 false（关闭）
  const getStoredEnabled = () => {
    const stored = localStorage.getItem('ruriko-killer-enabled');
    return stored === 'true'; // 只有明确为 'true' 才返回 true，否则 false
  };

  // 保存状态到 localStorage
  const saveEnabled = (value) => {
    localStorage.setItem('ruriko-killer-enabled', value);
  };

  // 全局控制标志 - 从存储中读取
  let isEnabled = getStoredEnabled();
  let timeoutId = null;

  // 路由器模拟/覆盖
  const router = { push: (url) => { } };
  router.push = (url) => {
    console.info('📍 跳转页面:', url);
    window.location.href = 'http://antchensw.cn' + url;
  };

  // 四分钟抓取逻辑
  const fourMinGetBugList = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    if (minutes % 4 === 0 && (seconds === 0 || seconds === 2 || seconds === 4)) {
      console.info(`⏰ 时间条件满足 (分钟:${minutes}, 秒:${seconds})，执行重定向到朋友页面`);
      router.push('/friend?p=1&t=5&w=');
    } else {
      console.info(`⏰ 时间条件不满足 (分钟:${minutes}, 秒:${seconds})，继续检查蟑螂选项`);
    }
  };

  // 主要逻辑
  const runMainLogic = () => {
    if (!isEnabled) {
      // 关闭状态，不执行任何操作
      return;
    }

    // 情况1: 匹配页面 - friend页面
    if (window.location.href.indexOf('http://antchensw.cn/friend?') !== -1) {
      console.info('📍 当前在朋友列表页面，开始检查时间条件和蟑螂选项');

      fourMinGetBugList();

      // 查找蟑螂单选按钮
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
            console.info('❌ 未找到bi-bug元素，无法跳转');
          }
        } else {
          console.info('🪳 蟑螂选项未选中，正在执行自动点击');
          cockroachRadio.click();
          cockroachRadio.dispatchEvent(new Event('change', { bubbles: true }));
          console.info('✅ 已自动切换到蟑螂选项');
          const selected: any = document.querySelector('input[type="radio"]:checked');
          console.info('📊 当前选中的选项:', selected ? (selected.value || '通过文字匹配的选项') : '无');
        }
      } else {
        console.info('❌ 找不到蟑螂选项，请手动检查页面上的单选框内容');
        console.info('📝 页面中所有单选框:', document.querySelectorAll('input[type="radio"]'));
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
              // 不递归调用，等待下一次循环
              return;
            } else {
              console.info('当前已在有蟑螂的楼层');
              bugFloor = true;
            }
          } else if (tagName === 'A' && !isMyBug) {
            if (bug[i].parentElement.innerHTML.indexOf('bi-shield-exclamation') !== -1) {
              console.info('🪳 发现蟑螂，正在点击');
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
    // 情况3: 其他页面
    else {
      console.info('📍 当前在其他页面，跳过处理');
    }
  };

  // 循环执行
  const loop = () => {
    runMainLogic();
    if (isEnabled) {
      console.info('🔄 工具箱运行中，继续下一次循环检查');
    }
    timeoutId = setTimeout(loop, ~~(Math.random() * 100) + 1000);
  };

  // 更新控制面板UI（如果存在）
  const updatePanelUI = () => {
    const statusText = document.getElementById('ruriko-status');
    const toggleBtn = document.getElementById('ruriko-toggle');
    if (!statusText || !toggleBtn) return;

    if (isEnabled) {
      statusText.innerText = '● 运行中';
      statusText.style.color = '#6bff6b';
      toggleBtn.innerText = '关闭';
      toggleBtn.style.background = '#6b6bff';
    } else {
      statusText.innerText = '● 已关闭';
      statusText.style.color = '#ff6b6b';
      toggleBtn.innerText = '开启';
      toggleBtn.style.background = '#ff6b6b';
    }
  };

  // 创建控制面板UI
  const createControlPanel = () => {
    // 检查是否已存在面板
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
      padding: 12px 16px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      font-family: system-ui, -apple-system, 'Segoe UI', monospace;
      font-size: 14px;
      display: flex;
      gap: 12px;
      align-items: center;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.2);
    `;

    const statusText = document.createElement('span');
    statusText.id = 'ruriko-status';
    statusText.style.cssText = `
      color: #ff6b6b;
      font-weight: bold;
      letter-spacing: 1px;
    `;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'ruriko-toggle';
    toggleBtn.style.cssText = `
      background: #ff6b6b;
      border: none;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      font-size: 13px;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    `;
    toggleBtn.onmouseenter = () => {
      toggleBtn.style.transform = 'scale(1.02)';
    };
    toggleBtn.onmouseleave = () => {
      toggleBtn.style.transform = 'scale(1)';
    };

    toggleBtn.onclick = () => {
      isEnabled = !isEnabled;
      saveEnabled(isEnabled);  // 保存到 localStorage
      updatePanelUI();
      if (isEnabled) {
        console.info('🚀 工具箱已开启，开始自动执行');
      } else {
        console.info('⏸️ 工具箱已关闭，停止自动执行');
      }
    };

    panel.appendChild(statusText);
    panel.appendChild(toggleBtn);
    document.body.appendChild(panel);

    // 设置初始UI状态
    updatePanelUI();
  };

  // 启动循环（即使关闭状态也会运行loop，但runMainLogic会被isEnabled拦截）
  const start = () => {
    createControlPanel();
    loop();
    const statusMsg = isEnabled ? '开启' : '关闭';
    console.info(`🎮 控制面板已添加，当前状态：${statusMsg}（状态已持久化，刷新/切页后保持）`);
  };

  start();
})();