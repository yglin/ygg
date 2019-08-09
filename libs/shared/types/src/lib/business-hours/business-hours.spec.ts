// import * as moment from 'moment';
import { BusinessHours } from './business-hours';
import { OpenHour } from "./open-hour/open-hour";

describe('Class BusinessHours', () => {
  let testBusinessHours: BusinessHours;

  beforeEach(() => {
    testBusinessHours = new BusinessHours();
  });

  it('can clear all open-hours', () => {
    testBusinessHours = BusinessHours.forge();
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
      new OpenHour(3, '03:00', '15:30'),
      new OpenHour(5, '11:00', '13:30'),
      new OpenHour(6, '06:00', '18:30'),
      new OpenHour(0, '11:00', '12:30'),
      new OpenHour(4, '09:00', '13:00'),
      new OpenHour(5, '22:00', '23:55'),
      new OpenHour(6, '12:00', '14:00'),
      new OpenHour(0, '12:00', '17:30')
    ]; // 2nd and 3rd open-hour overlap their time-ranges
    testBusinessHours.clear();
    for (const openHour of testOpenHours) {
      // console.log(`Add open-hour ${openHour.format()}`);
      testBusinessHours.addOpenHour(openHour);
    }

    const openHours: OpenHour[] = testBusinessHours.getOpenHours();
    expect(openHours[0].toJSON()).toEqual(new OpenHour(0, '11:00', '18:30').toJSON());
    expect(openHours[1].toJSON()).toEqual(new OpenHour(3, '03:00', '15:30').toJSON());
    expect(openHours[2].toJSON()).toEqual(new OpenHour(4, '09:00', '13:00').toJSON());
    expect(openHours[3].toJSON()).toEqual(new OpenHour(5, '11:00', '13:30').toJSON());
    expect(openHours[4].toJSON()).toEqual(new OpenHour(5, '22:00', '23:55').toJSON());
    expect(openHours[5].toJSON()).toEqual(new OpenHour(6, '06:00', '18:30').toJSON());
    expect(openHours.length).toBe(6);
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
    const expectOpenHours = [
      new OpenHour(6, '06:00', '12:00'),
      new OpenHour(6, '13:30', '18:30')
    ];
    expect(openHours[3].toJSON()).toEqual(expectOpenHours[0].toJSON());
    expect(openHours[4].toJSON()).toEqual(expectOpenHours[1].toJSON());
  });
});
