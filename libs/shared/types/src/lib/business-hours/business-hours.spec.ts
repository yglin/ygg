import * as moment from 'moment';
import { BusinessHours } from './business-hours';
import { OpenHour } from "./open-hour";

describe('Class BusinessHours', () => {
  let testBusinessHours: BusinessHours;

  beforeEach(() => {
    testBusinessHours = BusinessHours.forge();
  });

  it('can clear all open-hours', () => {
    testBusinessHours.clear();
    const openHours: OpenHour[] = testBusinessHours.getOpenHours();
    expect(openHours.length).toBe(0);
  });

  it('should auto sort by week day and time-range start', () => {
    const testOpenHours = [
      new OpenHour(0, '17:00', '18:30'),
      new OpenHour(3, '03:00', '04:30'),
      new OpenHour(3, '12:00', '13:30'),
      new OpenHour(5, '11:00', '13:30'),
      new OpenHour(6, '06:00', '18:30')
    ];
    testBusinessHours.clear();
    testBusinessHours.addOpenHour(testOpenHours[3]);
    testBusinessHours.addOpenHour(testOpenHours[1]);
    testBusinessHours.addOpenHour(testOpenHours[4]);
    testBusinessHours.addOpenHour(testOpenHours[0]);
    testBusinessHours.addOpenHour(testOpenHours[2]);

    const openHours = testBusinessHours.getOpenHours();
    expect(JSON.stringify(openHours)).toEqual(JSON.stringify(testOpenHours));
  });

  it('should auto merge overlapping open-hours', () => {
    const testOpenHours = [
      new OpenHour(0, '17:00', '18:30'),
      new OpenHour(3, '03:00', '12:30'),
      new OpenHour(3, '10:00', '13:30'),
      new OpenHour(5, '11:00', '13:30'),
      new OpenHour(6, '06:00', '18:30')
    ]; // 2nd and 3rd open-hour overlap their time-ranges
    testBusinessHours.clear();
    for (const openHour of testOpenHours) {
      testBusinessHours.addOpenHour(openHour);
    }

    const openHours: OpenHour[] = testBusinessHours.getOpenHours();
    expect(openHours.length).toBe(4); // 2 merged, so 5 -> 4,
    const secondStart = moment(openHours[1].timeRange.start);
    const secondEnd = moment(openHours[1].timeRange.end);
    expect(moment(secondStart).format('HH:mm')).toEqual('03:00');
    expect(moment(secondEnd).format('HH:mm')).toEqual('13:30');
  });

  it('can subtract open-hours', () => {
    const testOpenHours = [
      new OpenHour(0, '17:00', '18:30'),
      new OpenHour(3, '03:00', '04:30'),
      new OpenHour(5, '11:00', '13:30'),
      new OpenHour(6, '06:00', '18:30')
    ];
    testBusinessHours.clear();
    for (const openHour of testOpenHours) {
      testBusinessHours.addOpenHour(openHour);
    }

    testBusinessHours.subtractOpenHour(new OpenHour(6, '12:00', '13:30'));

    const openHours: OpenHour[] = testBusinessHours.getOpenHours();
    expect(openHours.length).toBe(5);// last open-hour splitted into 2
    expect(openHours[3].timeRange.format('HH:mm', 'HH:mm')).toEqual('06:00 - 12:00');
    expect(openHours[4].timeRange.format('HH:mm', 'HH:mm')).toEqual('13:30 - 18:30');
  });
});
