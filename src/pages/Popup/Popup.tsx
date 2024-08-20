import React, { useEffect, useState, useCallback } from 'react';
import { Switch } from '../../containers/Switch';
import { Collapse } from '../../containers/Collapse';
import './Popup.scss';

const Popup = () => {
  /** 开发者 */
  const [isDeveloper, setIsDeveloper] = useState(false);
  /** 是否显示布局 */ const [showLayout, setShowLayout] = useState(false);
  /** 是否显示XML输出 */ const [showXmlConsole, setShowXmlConsole] =
    useState(false);
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
  /** 切换是否是开发者 */ const changeIsDeveloper = (checked: boolean) => {
    setIsDeveloper(checked);
    chrome.storage.sync.set({ isDeveloper: checked }, () => {});
    let obj: any = {};
    chrome.storage.sync.get({ show_layout: {}, show_xmlConsole: {} }, (v) => {
      if (domain) {
        setShowLayout(checked);
        if (localStorage.getItem('show_layout') !== null) {
          obj = JSON.parse(localStorage.getItem('show_layout') || '{}');
        }
        localStorage.setItem('show_layout', JSON.stringify(obj));
        if (v.show_layout[domain] === checked ? 1 : 0) {
        } else {
          sendMessageToContentScript(
            {
              type: 'shell',
              value: checked ? 'showLayout' : 'hiddenLayout',
            },
            (response: any) => {
              console.debug('over');
            }
          );
        }
        domain && (v.show_layout[domain] = checked ? 1 : 0);
        chrome.storage.sync.set({ show_layout: v.show_layout }, () => {});
        if (!checked) {
          setShowXmlConsole(false);
          obj = {};
          if (localStorage.getItem('show_xmlConsole') !== null) {
            obj = JSON.parse(localStorage.getItem('show_xmlConsole') || '{}');
          }
          localStorage.setItem('show_xmlConsole', JSON.stringify(obj));
          if (v.show_xmlConsole[domain] === checked ? 1 : 0) {
          } else {
            if (v.show_xmlConsole[domain]) {
              sendMessageToContentScript(
                {
                  type: 'shell',
                  value: 'hiddenXmlConsole',
                },
                (response: any) => {
                  console.debug('over');
                }
              );
            }
          }
          domain && (v.show_xmlConsole[domain] = 0);
          chrome.storage.sync.set(
            { show_xmlConsole: v.show_xmlConsole },
            () => {}
          );
        }
      }
    });
  };
  /** 切换显示布局 */ const changeShowLayout = (e: any) => {
    let obj: any = {};
    chrome.storage.sync.get({ show_layout: {} }, (v) => {
      domain && (v.show_layout[domain] = showLayout ? 0 : 1);
      chrome.storage.sync.set({ show_layout: v.show_layout }, () => {
        if (localStorage.getItem('show_layout') !== null) {
          obj = JSON.parse(localStorage.getItem('show_layout') || '{}');
        }
        if (domain !== null) {
          domain && (obj[domain] = showLayout ? 0 : 1);
        }
        localStorage.setItem('show_layout', JSON.stringify(obj));
        setShowLayout(!showLayout);
        sendMessageToContentScript(
          {
            type: 'shell',
            value: showLayout ? 'hiddenLayout' : 'showLayout',
          },
          (response: any) => {
            console.debug('over');
          }
        );
      });
    });
  };
  /** 切换显示布局 */ const changeShowXmlConsole = (e: any) => {
    let obj: any = {};
    chrome.storage.sync.get({ show_xmlConsole: {} }, (v) => {
      domain && (v.show_xmlConsole[domain] = showXmlConsole ? 0 : 1);
      chrome.storage.sync.set({ show_xmlConsole: v.show_xmlConsole }, () => {
        if (localStorage.getItem('show_xmlConsole') !== null) {
          obj = JSON.parse(localStorage.getItem('show_xmlConsole') || '{}');
        }
        if (domain !== null) {
          domain && (obj[domain] = showXmlConsole ? 0 : 1);
        }
        localStorage.setItem('show_xmlConsole', JSON.stringify(obj));
        setShowXmlConsole(!showXmlConsole);
        sendMessageToContentScript(
          {
            type: 'shell',
            value: showXmlConsole ? 'hiddenXmlConsole' : 'showXmlConsole',
          },
          (response: any) => {
            console.debug('over');
          }
        );
      });
    });
  };
  useEffect(() => {
    console.log('初始化');
    chrome.storage.sync.get({ isDeveloper: false }, (v) => {
      setIsDeveloper(v.isDeveloper);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getCurrentTabUrl();
  }, [getCurrentTabUrl]);

  useEffect(() => {
    if (domain) {
      chrome.storage.sync.get({ show_layout: {} }, (v) => {
        setShowLayout(v.show_layout[domain] === 1);
      });
      chrome.storage.sync.get({ show_xmlConsole: {} }, (v) => {
        setShowXmlConsole(v.show_xmlConsole[domain] === 1);
      });
    }
  }, [domain]);
  return (
    <div className="App">
      <header></header>
      <div className="app-body">
        <Collapse
          title={
            <div className="flex-lc">
              <span>开发者模式</span>
              <Switch checked={isDeveloper} onChange={changeIsDeveloper} />
            </div>
          }
          content={
            isDeveloper && (
              <div className="developer-area">
                <div className="flex-lc">
                  <span>显示布局</span>
                  <Switch checked={showLayout} onClick={changeShowLayout} />
                </div>
                <div className="flex-lc">
                  <span>XML请求输出</span>
                  <Switch
                    checked={showXmlConsole}
                    onClick={changeShowXmlConsole}
                  />
                </div>
              </div>
            )
          }
        />
      </div>
    </div>
  );
};

export default Popup;
