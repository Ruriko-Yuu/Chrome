import { countDown } from './countDown'
import { bili } from './unique/bili'
import {
  showLayout,
  hiddenLayout,
  hiddenXmlConsole,
  showXmlConsole,
  developInit
} from './develop'
import { titleChange } from './title'

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

  localStorage.setItem('gensokyo', 'ruriko');

  titleChange()
  countDown()
  bili()
  developInit()
})();
