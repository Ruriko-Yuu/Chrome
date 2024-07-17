import React, { FC, memo, useEffect, useState, useRef } from 'react';
import './index.scss';
export const Collapse: FC<{
  title?: any;
  content?: any;
}> = memo(({ title, content }) => {
  const [collapseStatus, setCollapseStatus] = useState(false);
  const collapseContentRef = useRef<any>(null);
  const [collapseContentHeight, setCollapseContentHeight] = useState(0);
  useEffect(() => {
    // console.log(collapseContentRef.current);
    // setCollapseContentHeight(
    //   collapseStatus ? collapseContentRef.current.clientHeight : 0
    // );
  }, [collapseStatus]);

  return (
    <div className={['containers-collapse'].join('')}>
      <div className="collapse-header flex-c-sb">
        <div>{title}</div>
        <div
          onClick={() => {
            setCollapseContentHeight(
              collapseStatus ? 0 : collapseContentRef.current.clientHeight
            );
            setCollapseStatus(!collapseStatus);
          }}
        >
          {collapseStatus ? '😑' : '😝'}
        </div>
      </div>
      <div
        className="collapse-content-box"
        style={{
          ...(collapseContentHeight !== void 0
            ? { height: `${collapseContentHeight}px` }
            : {}),
        }}
      >
        <div
          ref={collapseContentRef}
          className={[
            'collapse-content',
            collapseStatus ? 'open' : 'close',
          ].join(' ')}
        >
          {content}
        </div>
      </div>
    </div>
  );
});
