import React from 'react';
import { render } from 'react-dom';

import Newtab from './Newtab';
import './index.scss';

render(<Newtab />, window.document.querySelector('#app-container'));
render(<video
  src={[
    '../../../public/media/video/AL-yearV.mp4',
    '../../../public/media/video/AL-20221222.mp4',
    '../../../public/media/video/AL-20230301.mp4',
    '../../../public/media/video/AL-lj.mp4',
    '../../../public/media/video/bg.1080p.vp8.vorbis.webm'
  ][Math.floor(Math.random()*5)]}
  autoPlay
  loop
></video>, window.document.querySelector('#bg-video'));

if (module.hot) module.hot.accept();
