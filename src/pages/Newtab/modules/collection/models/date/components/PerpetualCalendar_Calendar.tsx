import React, { memo, useEffect } from 'react';
import dayjs from 'dayjs'
const PerpetualCalendar_Calendar = memo<any>((props: any) => {
  const [year, setYear] = React.useState(dayjs().get('year'));
  useEffect(() => {
  }, []);

  return (
    <div className="calendar">
      日历{year}
    </div>
  );
});
export default PerpetualCalendar_Calendar;
