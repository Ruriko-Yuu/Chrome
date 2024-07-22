import React, { FC, memo, useEffect, useState } from 'react';
import './index.scss';
export const Switch: FC<{
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  onClick?: (e: any) => void;
  onChange?: (checked: boolean, e: any) => void;
}> = memo(({ checked, disabled, readonly, onClick, onChange }) => {
  const [switchChecked, setSwitchChecked] = useState(checked);

  const switchClick = (e: any) => {
    if (typeof onClick === 'function') {
      onClick(e);
    }
    emptyVoid();
  };
  const emptyVoid = () => {
    setSwitchChecked(!switchChecked);
    onChange && onChange(!switchChecked || false, null);
  };
  useEffect(() => {
    setSwitchChecked(checked)
  },[checked])
  return (
    <div
      className={[
        'containers-switch',
        checked ? ' on' : '',
        disabled ? ' disabled' : '',
        readonly ? ' readonly' : '',
      ].join('')}
      id="show-layout"
      onClick={switchClick}
    >
      <p>on</p>
      <p>off</p>
    </div>
  );
});
