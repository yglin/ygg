import * as moment from 'moment';
import { random } from "lodash";
import { DayTime } from "./day-time";

describe('class DayTime', () => {
  // it('constructor should accept (nothing), (DayTime), (string), (Moment) or (number , number)', () => {
  //   let dayTime = new DayTime();
  //   expect(dayTime.hour).toEqual(0);
  //   expect(dayTime.minute).toEqual(0);

  //   const otherDayTime = DayTime.forge();
  //   dayTime = new DayTime(otherDayTime);
  //   expect(dayTime.hour).toEqual(otherDayTime.hour);
  //   expect(dayTime.minute).toEqual(otherDayTime.minute);

  //   dayTime = new DayTime('11:22');
  //   expect(dayTime.hour).toEqual(11);
  //   expect(dayTime.minute).toEqual(22);

  //   const mnt = moment();
  //   dayTime = new DayTime(mnt);
  //   expect(dayTime.hour).toEqual(mnt.hour());
  //   expect(dayTime.minute).toEqual(mnt.minute());

  //   const hour = random(0, 23);
  //   const minute = random(0, 59);
  //   dayTime = new DayTime(hour, minute);
  //   expect(dayTime.hour).toEqual(hour);
  //   expect(dayTime.minute).toEqual(minute);
  // });

  it('should auto clamp hour to (0, 23); minute to (0, 59)', () => {
    let dayTime = new DayTime(-3, -20);
    expect(dayTime.format()).toEqual(`00:00`);
    dayTime = new DayTime(24, 60);
    expect(dayTime.format()).toEqual(`23:59`);
  });

  it('isSame()', () => {
    expect(new DayTime(10, 20).isSame(new DayTime(10, 20))).toBe(true);
    expect(new DayTime(-3, -20).isSame(new DayTime(-10, -20))).toBe(true);
    expect(new DayTime(43, 2312).isSame(new DayTime(55, 354))).toBe(true);
    expect(new DayTime(11, 22).isSame(new DayTime(5, 22))).toBe(false);
    expect(new DayTime(11, 22).isSame(new DayTime(11, 23))).toBe(false);
  });
  
  it('isAfter()', () => {
    expect(new DayTime(16, 20).isAfter(new DayTime(10, 20))).toBe(true);
    expect(new DayTime(10, 50).isAfter(new DayTime(10, 20))).toBe(true);
    expect(new DayTime(54, 4354).isAfter(new DayTime(-10, -20))).toBe(true);
    expect(new DayTime(9, 20).isAfter(new DayTime(17, 20))).toBe(false);
    expect(new DayTime(9, 20).isAfter(new DayTime(9, 56))).toBe(false);
    expect(new DayTime(9, 20).isAfter(new DayTime(9, 20))).toBe(false);
  });
  
});