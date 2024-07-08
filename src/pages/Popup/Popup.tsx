import React, { useEffect, useState, useCallback } from 'react';
import { Switch } from '../../containers/Switch';
import './Popup.scss';

const Popup = () => {
  /** 是否显示布局 */ const [showLayout, setShowLayout] = useState(false);
  /** 当前页域名 */ const [domain, setDomain] = useState(undefined);
  /** 获取当前选项卡ID */ const getCurrentTabId = (callback: any) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (callback) callback(tabs.length ? tabs[0].id : null);
    });
  };
  /** 获取当前标签页域名 */ const getCurrentTabUrl = useCallback(() => {
    getCurrentTabId((tabId: number) => {
      chrome.tabs.get(tabId, (e: { [key: string]: any }) => {
        let arr = e.url.split('/');
        setDomain(arr[2]);
      });
    });
  }, []);
  /** 向content-script主动发送消息 */ const sendMessageToContentScript = (
    message: any,
    callback: any
  ) => {
    getCurrentTabId((tabId: number) => {
      chrome.tabs.sendMessage(tabId, message, function (response) {
        if (callback) callback(response);
      });
    });
  };
  /** 切换显示布局 */ const changeShowLayout = (e: any) => {
    let obj: any = {};
    chrome.storage.sync.get({ dev_mode: {} }, (v) => {
      domain && (v.dev_mode[domain] = showLayout ? 0 : 1);
      chrome.storage.sync.set({ dev_mode: v.dev_mode }, () => {
        if (localStorage.getItem('dev_mode') !== null) {
          obj = JSON.parse(localStorage.getItem('dev_mode') || '{}');
        }
        if (domain !== null) {
          domain && (obj[domain] = showLayout ? 0 : 1);
        }
        localStorage.setItem('dev_mode', JSON.stringify(obj));
        setShowLayout(!showLayout);
        sendMessageToContentScript(
          {
            type: 'shell',
            value: showLayout ? 'devModeOff' : 'devModeOn',
          },
          (response: any) => {
            console.debug('over');
          }
        );
      });
    });
  };

  useEffect(() => {
    getCurrentTabUrl();
  }, [getCurrentTabUrl]);

  useEffect(() => {
    domain &&
      chrome.storage.sync.get({ dev_mode: {} }, (v) => {
        setShowLayout(v.dev_mode[domain] === 1);
      });
  }, [domain]);
  return (
    <div className="App">
      <header></header>
      <body>
        <div className="flex-lc">
          <span>显示布局</span>
          <Switch checked={showLayout} onClick={changeShowLayout} />
        </div>
      </body>
    </div>
  );
};

export default Popup;
