import '@pixi/unsafe-eval';
import { Live2DModel, MotionPreloadStrategy } from 'pixi-live2d-display';
import * as PIXI from 'pixi.js';
import React, { memo, useEffect } from 'react';
const Kanban = memo(() => {
  (window as any).PIXI = PIXI;
  const init = async () => {
    // 引入模型
    const model: any = await Live2DModel.from(
      // "../../../../resources/model/live2d/Hiyori/Hiyori.model3.json",
      '../../../public/model/live2d/lafei/lafei.model3.json',
      { motionPreload: MotionPreloadStrategy.NONE }
    );
    // 绑定模型点击事件动作
    model.on('pointerdown', (hitAreas: any) => {
      // model.motion('Idle')
      model.motion('');
    });
    // model.anchor.set(0.5); // 设置锚点为中心点
    // model.position.set(model.screen.width / 2, model.screen.height / 2); // 设置位置为屏幕中心

    // 设置缩放比例
    // model.scale.set(0.118);
    model.scale.set(0.458);
    // 创建模型对象
    const app = new PIXI.Application({
      // 配置模型舞台
      view: document.getElementById('kanban') as HTMLCanvasElement,
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
  useEffect(() => {
    init();
  }, []);
  return (
    <div id="kanban-space">
      <canvas id="kanban"></canvas>
    </div>
  );
});
export default Kanban;
