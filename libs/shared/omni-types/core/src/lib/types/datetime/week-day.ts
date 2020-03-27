export const WeekDayNames = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
];
export { WeekDay } from '@angular/common';
export function getWeekDayName(weekDay: number): string {
  return WeekDayNames[(weekDay % WeekDayNames.length)];
}
// export interface WeekDay {
//   value: number;
//   name: string;
// }

// export const WeekDayOptions: WeekDay[] = [
//   {
//     value: 0,
//     name: '星期日'
//   },
//   {
//     value: 1,
//     name: '星期ㄧ'
//   },
//   {
//     value: 2,
//     name: '星期二'
//   },
//   {
//     value: 3,
//     name: '星期三'
//   },
//   {
//     value: 4,
//     name: '星期四'
//   },
//   {
//     value: 5,
//     name: '星期五'
//   },
//   {
//     value: 6,
//     name: '星期六'
//   }
// ];
