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
})();
