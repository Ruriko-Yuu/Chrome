import React, { memo, useEffect } from 'react';
import dayjs from 'dayjs';
import './PerpetualCalendar_Calendar.scss';
import { Lunar } from 'lunar-javascript';
const PerpetualCalendar_Calendar = memo<any>((props: any) => {
  const [selectYear, setSelectYear] = React.useState(dayjs().get('year'));
  const [selectMonth, setSelectMonth] = React.useState(dayjs().get('month'));
  const [selectDate, setSelectDate] = React.useState(dayjs().get('date'));
  const [calYear, setCalYear] = React.useState(dayjs().get('year'));
  const [calMonth, setCalMonth] = React.useState(dayjs().get('month'));
  const [calDate, setCalDate] = React.useState(dayjs().get('date'));
  const [calList, setCalList] = React.useState<any>([]);
  useEffect(() => {
    const monthDays = dayjs().month(calMonth).daysInMonth();
    const beforeLength =
      dayjs()
        .set('year', calYear)
        .set('month', calMonth)
        .set('date', 1)
        .get('day') - 1;
    let list = [...new Array(beforeLength === -1 ? 6 : beforeLength)];
    for (let i = 1; i <= monthDays; i++) {
      const obj: any = {};
      const lunar = Lunar.fromDate(
        new Date(
          dayjs()
            .set('year', calYear)
            .set('month', calMonth)
            .set('date', i)
            .format('YYYY-MM-DD')
        )
      );
      obj.getJieQi = (lunar as any).getJieQi();
      obj.getDayInChinese = lunar.getDayInChinese();
      obj.date = i;
      list.push(obj);
    }
    console.log('list', list);
    list.push(...new Array(Math.ceil(list.length / 7) * 7 - list.length));
    setCalList(list);
  }, [calMonth, calYear]);

  useEffect(() => {
    props.selectDate(
      dayjs()
        .set('year', selectYear)
        .set('month', selectMonth)
        .set('date', selectDate)
        .format('YYYY-MM-DD')
    );
  }, [props, selectYear, selectMonth, selectDate]);

  return (
    <div className="perpetual-calendar-calendar">
      <div style={{ display: 'flex' }}>
        <p
          onClick={() => {
            if (calMonth === 0) {
              setCalMonth(11);
              setCalYear(calYear - 1);
            } else {
              setCalMonth(calMonth - 1);
            }
          }}
        >
          &lt;
        </p>
        {calYear}-{calMonth + 1}
        <p
          onClick={() => {
            console.log(
              calYear + Math.floor((calMonth + 1) / 12),
              (calMonth + 1) % 12
            );
            setCalMonth((calMonth + 1) % 12);
            setCalYear(calYear + Math.floor((calMonth + 1) / 12));
          }}
        >
          &gt;
        </p>
      </div>
      <ul
        style={{
          gridTemplateRows: `repeat(${Math.ceil(calList.length / 7)}, 1fr)`,
        }}
      >
        {calList.map((ele: any, idx: React.Key | null | undefined) => {
          return (
            <li
              key={idx}
              onClick={() => {
                if (!ele) return;
                setSelectYear(calYear);
                setSelectMonth(calMonth);
                setSelectDate(ele?.date);
              }}
              className={`${
                calDate === ele?.date &&
                `${calYear}-${calMonth + 1}` === dayjs().format('YYYY-MM')
                  ? 'this'
                  : ''
              } ${
                props.date ===
                `${calYear}-${calMonth + 1 < 10 ? '0' : ''}${calMonth + 1}-${
                  ele?.date < 10 ? '0' : ''
                }${ele?.date}`
                  ? 'active'
                  : ''
              }`}
            >
              <div>
                <p>{ele?.date}</p>
                <p>{ele ? ele.getJieQi || ele.getDayInChinese : ''}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
export default PerpetualCalendar_Calendar;
