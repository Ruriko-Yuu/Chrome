import React from 'react';
import axios from 'axios';
import './index.scss';

class SearchSpace extends React.Component<any> {
  state = {
    engine: 'bd',
    word: '',
    searchList: [] as any,
    searchActive: -1,
    storage: {},
    engineListShow: false,
  };

  wordChange = (e: { target: { value: string } }) => {
    this.setState({ searchActive: -1 });
    this.setState({ word: e.target.value }, this.getSearchList);
  };

  changeEngine = () => {
    this.setState({ engineListShow: true }, () => {
      setTimeout(() => {
        window.addEventListener(
          'click',
          () => {
            this.setState({ engineListShow: false });
          },
          { once: true }
        );
      }, 0);
    });
  };

  getSearchList = () => {
    if (this.state.word === '') {
      this.setState({ searchList: [] }, this.htmlsearchList);
    } else {
      const storage: { [key: string]: [string] } = this.state.storage;
      if (storage[this.state.word]) {
        const searchList = storage[this.state.word];
        this.setState({ searchList });
      } else {
        if (this.state.engine === 'bd') {
          axios
            .get('https://suggestion.baidu.com/su', {
              params: {
                pre: 1,
                p: 3,
                ie: 'utf-8',
                cb: '',
                prod: 'pc',
                from: 'pc_web',
                wd: this.state.word,
                req: 2,
                csor: this.state.word.length,
                sugsid:
                  '36554,36624,36726,36455,36413,34812,36691,36167,36679,36774,36745,36762,36771,36766,26350,36864,36649',
              },
            })
            .then((res) => {
              if (res.status === 200) {
                const data = res.data;
                console.log("🚀 ~ SearchSpace ~ .then ~ data:", data)
                let a = data
                  .slice(1, data.length - 2)
                  .replace(/\{q:/, `{"q":`)
                  .replace(/,s:/, `,"s":`)
                  .replace(/,p:/, `,"p":`)
                  .replace(/\}/, `}`);
                const searchList = JSON.parse(a)
                  .s.slice(0, 9)
                  .map((ele: any) => {
                    return {
                      q: ele,
                      u: '',
                    };
                  });
                storage[this.state.word] = searchList;
                this.setState({ searchList, storage });
              }
            });
        } else {
          axios
            .get('https://cn.bing.com/AS/Suggestions', {
              params: {
                pt: 'page.home',
                mkt: 'zh-cn',
                qry: this.state.word,
                cp: this.state.word.length,
                csr: 1,
                msbqf: false,
                pths: 1,
                cvid: 'DC5FDC0F945B4F4787A8CC94D2751FD6',
              },
            })
            .then((res) => {
              if (res.status === 200) {
                const searchList = res.data.s.slice(0, 9);
                storage[this.state.word] = searchList;
                this.setState({ searchList, storage });
              }
            });
        }
      }
    }
  };

  searchEnter = (e: any) => {
    switch (e.code) {
      case 'Enter':
        if (e.keyCode === 13) {
          if (this.state.engine === 'bd') {
            if (this.state.searchActive === -1) {
              window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${this.state.word}`;
            } else {
              window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${
                this.state.searchList[this.state.searchActive].q
              }`;
            }
          } else {
            if (this.state.searchActive === -1) {
              window.location.href = `https://cn.bing.com/search?q=${this.state.word}&form=QBLHCN&sp=-1&lq=0&pq=${this.state.word}%E6%8E%A5%E5%8F%A3&sc=12-2&qs=n&sk=&cvid=1856A97F189F4E7BB16F20BAECAD4F4F`;
            } else {
              window.location.href = `https://cn.bing.com/${
                this.state.searchList[this.state.searchActive].u
              }`;
            }
          }
        }
        break;
      case 'ArrowDown':
        var num = (this.state.searchActive + 1) % this.state.searchList.length;
        this.setState({ searchActive: num });
        console.log(this.state.searchActive);
        break;
      case 'ArrowUp':
        if (this.state.searchActive <= 0) {
          num = this.state.searchList.length - 1;
        } else {
          num = (this.state.searchActive - 1) % this.state.searchList.length;
        }
        this.setState({ searchActive: num });
        console.log(this.state.searchActive);
        break;
      default:
        // console.log(e.code);
        break;
    }
    // console.log(e);
  };

  htmlsearchList = () => {
    const backRedFont = (str: string): any => {
      const arr = str.split(this.state.word);
      if (arr.length === 1) {
        return <>{str}</>;
      } else {
        return (
          <>
            {arr[0]}
            <span style={{ color: 'red' }}>{this.state.word}</span>
            {arr.slice(1).join(this.state.word)}
          </>
        );
      }
    };
    return this.state.searchList.length === 0 ? (
      ''
    ) : (
      <ul className="search-list">
        {this.state.searchList.map((ele: any, idx: number) => (
          <li
            className={this.state.searchActive === idx ? 'is-active' : ''}
            onClick={(e) => {
              if (this.state.engine === 'bd') {
                console.log(ele)
                window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${ele.q}`;
              } else {
                window.location.href = `https://cn.bing.com/${ele.u}`;
              }
            }}
            key={idx}
          >
            {backRedFont(ele.q)}
          </li>
        ))}
      </ul>
    );
  };

  engineList = () => {
    return (
      <ul className="engine-list">
        <li
          onClick={() => {
            this.setState({ engine: 'bd', engineListShow: false, storage: {} });
            // this.getSearchList();
          }}
        >
          <i>
            <img
              src="../../../../../public/media/image/icon/baidu.webp"
              alt=""
            />
          </i>
          百度
        </li>
        <li
          onClick={() => {
            this.setState({
              engine: 'bing',
              engineListShow: false,
              storage: {},
            });
            // this.getSearchList();
          }}
        >
          <i>
            <img src="../../../../../public/media/image/icon/ODLS.png" alt="" />
          </i>
          bing
        </li>
      </ul>
    );
  };
  render() {
    return (
      <div className="search-space">
        <div className="engine-select" onClick={this.changeEngine}>
          <i>
            {this.state.engine === 'bd' ? (
              <img
                src="../../../../../public/media/image/icon/baidu.webp"
                alt=""
              />
            ) : (
              <img
                style={{ width: '18px', height: '18px', display: 'block' }}
                src="../../../../../public/media/image/icon/ODLS.png"
                alt=""
              />
            )}
          </i>
          <span className="ream">▼</span>
        </div>
        {this.state.engineListShow && this.engineList()}
        <input
          placeholder="搜索网页"
          type="text"
          autoComplete="off"
          value={this.state.word}
          onKeyDown={this.searchEnter}
          onChange={this.wordChange}
          onFocus={() => {
            this.state.word !== '' && this.getSearchList();
          }}
          onBlur={() =>
            setTimeout(() => {
              this.setState({ searchList: [] });
            }, 5e2)
          }
        />
        {this.state.word === '' ? (
          ''
        ) : (
          <i
            className="clear"
            onClick={() => {
              this.setState({ word: '', searchList: [] });
            }}
          >
            ✖
          </i>
        )}
        {this.htmlsearchList()}
      </div>
    );
  }
  componentDidMount() {
    // const color = 'red';
    // function cge(backgroundColor: string) {
    //   document.body.style.backgroundColor = backgroundColor;
    // }
    // chrome.tabs.query({ active: false, currentWindow: true }, function (tabs) {
    //   if (tabs[0].id !== void 0) {
    //     chrome.scripting.executeScript({
    //       target: { tabId: tabs[0].id },
    //       func: cge,
    //       args: [color],
    //     });
    //   }
    // });
  }
}

export default SearchSpace;
