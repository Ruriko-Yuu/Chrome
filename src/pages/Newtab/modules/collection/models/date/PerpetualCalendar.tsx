import React, { memo, useState } from 'react';
import PerpetualCalendarCalendar from './components/PerpetualCalendar_Calendar';
import PerpetualCalendarComplex from './components/PerpetualCalendar_Complex';
import './PerpetualCalendar.scss';
const HexagramSpace = memo<any>((props: any) => {
  const [state, setState] = useState({ loadOver: true });
  const [date, setDate] = useState('');
  const selectDate = (date: any) => {
    setDate(date);
  };
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
            <PerpetualCalendarCalendar selectDate={selectDate} />
          </div>
          <div className="right">
            <PerpetualCalendarComplex date={date} />
          </div>
        </div>
      </div>
    </div>
  );
});
export default HexagramSpace;
