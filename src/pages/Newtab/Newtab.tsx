import React, { useEffect } from 'react';
import AudioTips from './plugins/audiotips';
import SearchSpace from './modules/search/index';
import CollectionSpace from './modules/collection/index';
import { videoAuto } from './plugins/bg';
import { docHidden, visibilityCge } from './plugins/constant';
import * as PIXI from 'pixi.js';
import '@pixi/unsafe-eval'
import {
  Live2DModel,
  MotionPreloadStrategy,
  InternalModel,
} from 'pixi-live2d-display';
import './Newtab.scss';
const workflow: any = new AudioTips();
let doc: any = document;

const Newtab = () => {
  (window as any).PIXI = PIXI;
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
    const createScript = (obj: { [ket: string]: string }) => {
      const script = document.createElement('script');
      script.src = obj.src;
      script.type = 'application/javascript';
      document.body.appendChild(script);
    };
    // createScript({src: '../../../public/js/live2d/live2d.min.js'})
    // createScript({ src: '../../../public/js/live2d/live2dcubismcore.min.js' })
    init()
  }, []);

  const init = async () => {
  	// 引入模型
  	const model: any = await Live2DModel.from(
  		// "../../../../resources/model/live2d/Hiyori/Hiyori.model3.json",
  		"../../../public/model/live2d/lafei/lafei.model3.json",
  		{ motionPreload: MotionPreloadStrategy.NONE }
  	);
  	// 绑定模型点击事件动作
  	model.on("pointerdown", (hitAreas: any) => {
  		// model.motion('Idle')
  		model.motion('')
  	});
  	// model.anchor.set(0.5); // 设置锚点为中心点
  	// model.position.set(model.screen.width / 2, model.screen.height / 2); // 设置位置为屏幕中心

  	// 设置缩放比例
  	// model.scale.set(0.118);
  	model.scale.set(0.218);
  	// 创建模型对象
  	const app = new PIXI.Application({
  		// 配置模型舞台
  		view: document.getElementById("kanban") as HTMLCanvasElement,
  		// 背景是否透明
  		transparent: true,
  		autoDensity: true,
  		// autoResize: true,
  		antialias: true,
  		// 高度
  		height: 1024,
  		// 宽度
  		width: 1024,
  	});
  	app.stage.addChild(model);
  };

  return (
    <div className="App">
      <SearchSpace />
      <CollectionSpace />
      <div id="kanban-space">
        <canvas id="kanban"></canvas>
      </div>
    </div>
  );
};

export default Newtab;
