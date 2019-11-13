import * as moment from 'moment';
import { DayTimeRange } from "./day-time-range";
import { DayTime } from '../day-time/day-time';

describe('class DayTimeRange', () => {
  it('constructor accept (nothing), (DayTimeRange), (DayTime | string | Moment, DayTime | string | Moment)', () => {
    const dayTimeZero = new DayTime(0, 0);
    let dtr = new DayTimeRange();
    expect(dtr.start.toJSON()).toEqual(dayTimeZero.toJSON());
    expect(dtr.end.toJSON()).toEqual(dayTimeZero.toJSON());

    const otherDayTimeRange = DayTimeRange.forge();
    dtr = new DayTimeRange(otherDayTimeRange);
    expect(dtr.start.toJSON()).toEqual(otherDayTimeRange.start.toJSON());
    expect(dtr.end.toJSON()).toEqual(otherDayTimeRange.end.toJSON());

    let start:any = new DayTime(10, 20);
    let end:any = new DayTime(13, 55);
    dtr = new DayTimeRange(start, end);
    expect(dtr.start.toJSON()).toEqual(start.toJSON());
    expect(dtr.end.toJSON()).toEqual(end.toJSON());

    const startString = '10:20';
    const endString = '13:55';
    start = new DayTime(startString);
    end = new DayTime(endString);

    dtr = new DayTimeRange(startString, endString);
    expect(dtr.start.toJSON()).toEqual(start.toJSON());
    expect(dtr.end.toJSON()).toEqual(end.toJSON());

    const startMnt = moment(startString, 'HH:mm');
    const endMnt = moment(endString, 'HH:mm');
    dtr = new DayTimeRange(startMnt, endMnt);
    expect(dtr.start.toJSON()).toEqual(start.toJSON());
    expect(dtr.end.toJSON()).toEqual(end.toJSON());
  });
  
  it('should automatically justify its start and end order', () => {
    const tr = new DayTimeRange('18:00', '06:00');
    expect(tr.format('HH:mm')).toEqual('06:00 - 18:00');
  });

  it('isAfter() compare 2 day-time-ranges by the priority of: start, end', () => {
    // By start time
    let dtr1 = new DayTimeRange('14:00', '15:30');
    let dtr2 = new DayTimeRange('12:30', '17:00');
    expect(dtr1.isAfter(dtr2)).toBe(true);
    dtr1 = new DayTimeRange('09:00', '22:30');
    dtr2 = new DayTimeRange('12:30', '17:00');
    expect(dtr1.isAfter(dtr2)).toBe(false);

    // By end time
    dtr1 = new DayTimeRange('12:30', '22:30');
    dtr2 = new DayTimeRange('12:30', '17:00');
    expect(dtr1.isAfter(dtr2)).toBe(true);
    dtr1 = new DayTimeRange('12:30', '13:30');
    dtr2 = new DayTimeRange('12:30', '17:00');
    expect(dtr1.isAfter(dtr2)).toBe(false);
  });
  

  it('can merge 2 intersected time ranges', () => {
    let tr1 = new DayTimeRange('08:30', '11:00');
    let tr2 = new DayTimeRange('10:00', '12:00');
    let merged = tr1.merge(tr2);
    expect(merged.format()).toEqual('08:30 - 12:00');
    tr1 = new DayTimeRange('06:30', '10:00');
    tr2 = new DayTimeRange('07:22', '8:32');
    merged = tr1.merge(tr2);
    expect(merged.format()).toEqual('06:30 - 10:00');
    tr1 = new DayTimeRange('09:30', '11:22');
    tr2 = new DayTimeRange('10:55', '11:22');
    merged = tr1.merge(tr2);
    expect(merged.format()).toEqual('09:30 - 11:22');
    tr1 = new DayTimeRange('14:16', '17:22');
    tr2 = new DayTimeRange('14:16', '22:45');
    merged = tr1.merge(tr2);
    expect(merged.format()).toEqual('14:16 - 22:45');
    tr1 = new DayTimeRange('05:43', '11:55');
    tr2 = new DayTimeRange('14:32', '16:28');
    merged = tr1.merge(tr2);
    // return null if non-intersected
    expect(merged).toBeNull();
  });

  it('can subtract time range into 2', () => {
    let tr1 = new DayTimeRange('08:30', '15:00');
    let tr2 = new DayTimeRange('10:00', '12:00');
    let subtracted = tr1.subtract(tr2);
    expect(subtracted[0].format('HH:mm')).toEqual('08:30 - 10:00');
    expect(subtracted[1].format('HH:mm')).toEqual('12:00 - 15:00');    
    tr1 = new DayTimeRange('08:30', '12:00');
    tr2 = new DayTimeRange('10:00', '12:00');
    subtracted = tr1.subtract(tr2);
    expect(subtracted[0].format('HH:mm')).toEqual('08:30 - 10:00');
    tr1 = new DayTimeRange('08:30', '12:00');
    tr2 = new DayTimeRange('08:00', '09:00');
    subtracted = tr1.subtract(tr2);
    expect(subtracted[0].format('HH:mm')).toEqual('09:00 - 12:00');
    tr1 = new DayTimeRange('08:30', '12:00');
    tr2 = new DayTimeRange('14:00', '15:00');
    subtracted = tr1.subtract(tr2);
    expect(subtracted[0].format('HH:mm')).toEqual('08:30 - 12:00');
  });  
});