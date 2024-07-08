import React, { FC, memo, useEffect } from 'react';
import './index.scss';
export const Switch: FC<{ checked?: boolean; onClick?: (e: any) => void }> =
  memo(({ checked, onClick }) => {
    const emptyVoid = () => {};
    return (
      <div
        className={`containers-switch${checked ? ' on' : ''}`}
        id="show-layout"
        onClick={onClick || emptyVoid}
      >
        <p>on</p>
        <p>off</p>
      </div>
    );
  });
