import React from 'react';
import Sortable from 'sortablejs';
import bookmarkList from '../../plugins/bookmarks';
import { defaultCollectionList } from './config';
import './index.scss';
import DateBlock from './models/date/index';
import PerpetualCalendar from './models/date/PerpetualCalendar';
import HexagramSpace from './models/hexagram/index';
import KeyboardSpace from './models/keyboard/index';
import StatisticsSpace from './models/statistics/index';
class CollectionSpace extends React.Component<any> {
  state = {
    collectionList: defaultCollectionList,
    collectionActive: '',
    dateObj: {
      week: '',
      month: '',
      day: '',
      hour: '',
      minute: '',
      second: '',
    },
  };
  removeCollectionActive = () => {
    this.setState({ collectionActive: '' });
  };
  render() {
    return (
      <>
        <ul
          className="collection-space"
          style={{
            height:
              Math.ceil(
                (this.state.collectionList.filter((ele) => ele).length + 3) / 8
              ) *
                80 +
              'px',
          }}
        >
          {this.state.collectionList
            .filter((ele) => ele)
            .map((ele, idx) =>
              ele.type === 'function' ? (
                ele.value === 'Date' ? (
                  <DateBlock
                    dateBlockClick={() => {
                      this.setState({ collectionActive: ele.value });
                    }}
                    key={idx}
                  />
                ) : (
                  <li
                    key={idx}
                    onClick={() => {
                      if (ele.type === 'function') {
                        this.setState({ collectionActive: ele.value });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={
                        ele.icon ||
                        '../../../../../public/media/image/icon/404.jpg'
                      }
                      alt=""
                    />
                    <p>{ele.title || '🖐🏻🐟ing...'}</p>
                  </li>
                )
              ) : (
                <li key={idx}>
                  <a href={ele.href}>
                    <img
                      src={
                        ele.icon ||
                        '../../../../../public/media/image/icon/404.jpg'
                      }
                      alt=""
                    />
                    <p>{ele.title || '🖐🏻🐟ing...'}</p>
                  </a>
                </li>
              )
            )}
        </ul>
        <ul className="collection-space" id="sort"></ul>
        {this.state.collectionActive === 'Date' && (
          <PerpetualCalendar
            removeCollectionActive={this.removeCollectionActive}
          />
        )}
        {this.state.collectionActive === 'StatisticsSpace' && (
          <StatisticsSpace
            removeCollectionActive={this.removeCollectionActive}
          />
        )}
        {this.state.collectionActive === 'Hexagram' && (
          <HexagramSpace removeCollectionActive={this.removeCollectionActive} />
        )}
        {this.state.collectionActive === 'Keyboard' && (
          <KeyboardSpace removeCollectionActive={this.removeCollectionActive} />
        )}
      </>
    );
  }
  unNameFun = () => {
    chrome.storage.sync.get('collectionList', (v) => {
      console.log(v['collectionList'], defaultCollectionList);
      if (
        v['collectionList'].filter((ele: any) => ele).length ===
        defaultCollectionList.length
      ) {
        this.setState({
          collectionList: v['collectionList']
            ? v['collectionList']
            : defaultCollectionList,
        });
      }
    });
    var el = document.getElementsByClassName(
      'collection-space'
    )[0] as HTMLElement;
    let sortable: Sortable;
    //设置配置
    var ops = {
      animation: 300,
      //拖动结束
      onEnd: (evt: any) => {
        let collectionList = this.state.collectionList;
        const obj = collectionList.splice(evt.oldIndex, 1);
        collectionList.splice(evt.newIndex, 0, obj[0]);
        console.log(collectionList);
        chrome.storage.sync.set({ collectionList });
      },
    };
    if (el !== null) {
      sortable = Sortable.create(el, ops);
    }
  };
  componentDidMount() {
    bookmarkList();
    this.unNameFun();
  }
  componentWillUnmount() {}
}
export default CollectionSpace;
