/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import './Panel.scss';

const Panel: React.FC = () => {
  console.debug(window, (window as any).performance.memory);
  return <div className="container"></div>;
};

export default Panel;
