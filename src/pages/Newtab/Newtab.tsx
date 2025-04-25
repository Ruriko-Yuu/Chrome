import React, { useEffect } from 'react';
import CollectionSpace from './modules/collection/index';
import SearchSpace from './modules/search/index';
import './Newtab.scss';
import AudioTips from './plugins/audiotips';
import { videoAuto } from './plugins/bg';
import { docHidden, visibilityCge } from './plugins/constant';
import Kanban from './modules/kanban';
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
          document.title = 'doro 🍊';
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
      console.log(localStorage.getItem('speechInteraction'), localStorage.getItem('OnTimeAlarm'))
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
      <Kanban />
    </div>
  );
};

export default Newtab;
