import React, { useEffect } from 'react';
import AudioTips from './plugins/audiotips';
import SearchSpace from './modules/search/index';
import CollectionSpace from './modules/collection/index';
import { videoAuto } from './plugins/bg';
import { docHidden, visibilityCge } from './plugins/constant';
import './Newtab.scss';
const workflow: any = new AudioTips();
let doc: any = document;

const Newtab = () => {
  useEffect(() => {
    document.addEventListener(
      visibilityCge,
      () => {
        if (doc[docHidden]) {
          document.title = '(╯‵□′)╯︵┻━┻';
        } else {
          document.title = '';
          localStorage.getItem('speechInteraction') &&
            workflow.constructor.speechInteraction('meetAgain');
          setTimeout(() => {
            document.title = '新标签页';
          }, 1e4);
        }
      },
      false
    );
    window.addEventListener('resize', videoAuto);

    window.onload = () => {
      localStorage.getItem('speechInteraction') &&
        workflow.constructor.speechInteraction();
      localStorage.getItem('OnTimeAlarm') &&
        workflow.constructor.speechInteraction('OnTimeAlarm');
    };
    videoAuto();
  }, []);
  return (
    <div className="App">
      <SearchSpace />
      <CollectionSpace />
    </div>
  );
};

export default Newtab;
