import * as PIXI from 'pixi.js';
import React, { memo, useEffect, useRef } from 'react';

const Kanban = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  const init = async () => {
    console.log('[Kanban] init 开始');

    // 1. 先安装 unsafe-eval 补丁
    try {
      const unsafeEval = await import('@pixi/unsafe-eval');
      console.log('[Kanban] unsafe-eval 模块导出:', Object.keys(unsafeEval));

      if (typeof (unsafeEval as any).install === 'function') {
        (unsafeEval as any).install(PIXI);
        console.log('[Kanban] unsafe-eval 补丁已手动安装');
      } else {
        console.log('[Kanban] unsafe-eval 通过副作用导入生效');
      }
    } catch (e) {
      console.error('[Kanban] unsafe-eval 加载失败:', e);
    }

    (window as any).PIXI = PIXI;
    console.log('[Kanban] window.PIXI 已赋值:', !!(window as any).PIXI);
    console.log('[Kanban] Live2DCubismCore 是否存在:', !!(window as any).Live2DCubismCore);

    // 2. 动态导入 live2d（确保在 unsafe-eval 之后）
    const { Live2DModel, MotionPreloadStrategy } = await import('pixi-live2d-display');

    const container = containerRef.current;
    console.log('[Kanban] container:', container);
    console.log('[Kanban] container 尺寸:', container?.clientWidth, 'x', container?.clientHeight);

    if (!container) {
      console.error('[Kanban] container 不存在，退出');
      return;
    }

    // 3. 加载模型
    console.time('[Kanban] Live2DModel.from 耗时');
    let model: any;
    try {
      model = await Live2DModel.from(
        '../../../public/model/live2d/lafei/lafei.model3.json',
        { motionPreload: MotionPreloadStrategy.NONE }
      );
      console.timeEnd('[Kanban] Live2DModel.from 耗时');
      console.log('[Kanban] model 加载成功:', model);
    } catch (e) {
      console.timeEnd('[Kanban] Live2DModel.from 耗时');
      console.error('[Kanban] model 加载失败:', e);
      return;
    }

    // 4. 绑定点击事件
    model.on('pointerdown', (hitAreas: any) => {
      console.log('[Kanban] 模型被点击, hitAreas:', hitAreas);
      model.motion('');
    });

    // 5. 创建 PIXI Application
    console.log('[Kanban] 准备创建 PIXI.Application');
    let app: PIXI.Application;
    try {
      app = new PIXI.Application({
        backgroundAlpha: 0,
        autoDensity: true,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        resizeTo: container,
      });
      console.log('[Kanban] PIXI.Application 创建完成');
    } catch (e) {
      console.error('[Kanban] PIXI.Application 创建失败:', e);
      return;
    }

    console.log('[Kanban] app.renderer 尺寸:', app.renderer.width, 'x', app.renderer.height);
    console.log('[Kanban] app.view 类型:', app.view?.constructor?.name);

    // 6. 挂载 canvas
    container.appendChild(app.view as HTMLCanvasElement);
    console.log('[Kanban] canvas 已挂载到容器');
    const canvasEl = app.view as HTMLCanvasElement;
    console.log('[Kanban] canvas 实际尺寸:', canvasEl.width, 'x', canvasEl.height);
    console.log('[Kanban] canvas CSS 尺寸:', canvasEl.style.width, 'x', canvasEl.style.height);

    appRef.current = app;

    // 7. 设置模型位置与缩放
    model.anchor.set(0.5);
    model.position.set(app.renderer.width / 2, app.renderer.height / 2);
    model.scale.set(0.458);
    console.log('[Kanban] model 位置:', model.x, model.y);
    console.log('[Kanban] model 锚点:', model.anchor.x, model.anchor.y);
    console.log('[Kanban] model 缩放:', model.scale.x, model.scale.y);

    // 8. 添加到舞台
    app.stage.addChild(model);
    console.log('[Kanban] model 已加入 stage');
    console.log('[Kanban] model 可见性:', model.visible);
    console.log('[Kanban] model 世界变换:', model.worldTransform);
    console.log('[Kanban] stage children 数量:', app.stage.children.length);

    // 9. 手动渲染一帧
    app.render();
    console.log('[Kanban] 手动渲染一帧完成');
    console.log('[Kanban] app.ticker.started:', app.ticker.started);
  };

  useEffect(() => {
    console.log('[Kanban] useEffect 触发');
    init();

    return () => {
      console.log('[Kanban] 组件卸载，销毁 app');
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []);

  return <div id="kanban-space" ref={containerRef} />;
});

export default Kanban;