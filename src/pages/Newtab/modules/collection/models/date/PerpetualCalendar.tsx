import React, { memo, useEffect, useState } from 'react';
import { Lunar } from 'lunar-javascript';
import PerpetualCalendar_Calendar from './components/PerpetualCalendar_Calendar';
import './PerpetualCalendar.scss';
const HexagramSpace = memo<any>((props: any) => {
  const [state, setState] = useState({ loadOver: true });
  useEffect(() => {
    const lunar = Lunar.fromDate(new Date());
    console.log('lunar', lunar);
    for (const key in lunar) {
      if (Object.prototype.hasOwnProperty.call(lunar, key)) {
        try {
          console.log(key, (lunar as any)[key]());
        } catch (error) {}
      }
    }
  }, []);

  return (
    <div className="perpetual-calendar-space">
      <div className={state.loadOver ? 'content over' : 'content'}>
        <i
          className="close"
          onClick={() => {
            setState({ loadOver: false });
            setTimeout(() => {
              props.removeCollectionActive();
            }, 46e1);
          }}
        >
          ✖
        </i>
        <div className="left--right">
          <div className="left">
            <PerpetualCalendar_Calendar />
          </div>
        </div>
      </div>
    </div>
  );
});
export default HexagramSpace;
