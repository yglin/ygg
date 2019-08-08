import { OpenHour } from "./open-hour";

describe('class OpenHour', () => {
  it('isAfter() compare 2 open-hours by the priority of: weekDay, start, end', () => {
    // By weekDay
    let oh1 = new OpenHour(3, '11:00', '15:30');
    let oh2 = new OpenHour(1, '12:30', '17:00');
    expect(oh1.isAfter(oh2)).toBe(true);
    oh1 = new OpenHour(0, '11:00', '15:30');
    oh2 = new OpenHour(6, '12:30', '17:00');

    // By start time
    expect(oh1.isAfter(oh2)).toBe(false);
    oh1 = new OpenHour(3, '14:00', '15:30');
    oh2 = new OpenHour(3, '12:30', '17:00');
    expect(oh1.isAfter(oh2)).toBe(true);
    oh1 = new OpenHour(3, '09:00', '22:30');
    oh2 = new OpenHour(3, '12:30', '17:00');
    expect(oh1.isAfter(oh2)).toBe(false);

    // By end time
    oh1 = new OpenHour(0, '12:30', '22:30');
    oh2 = new OpenHour(0, '12:30', '17:00');
    expect(oh1.isAfter(oh2)).toBe(true);
    oh1 = new OpenHour(0, '12:30', '13:30');
    oh2 = new OpenHour(0, '12:30', '17:00');
    expect(oh1.isAfter(oh2)).toBe(false);
  });
  
  it('can merged 2 intersected open-hours', () => {
    let oh1 = new OpenHour(1, '11:00', '15:30');
    let oh2 = new OpenHour(1, '12:30', '17:00');
    let merged = oh1.merge(oh2);
    expect(merged.format()).toEqual('星期一 11:00 - 17:00');
    oh1 = new OpenHour(1, '11:00', '15:30');
    oh2 = new OpenHour(2, '12:30', '17:00');
    merged = oh1.merge(oh2);
    expect(merged).toBeNull();
  });

  it('can subtract open-hour and split', () => {
    let oh1 = new OpenHour(1, '11:00', '18:30');
    let oh2 = new OpenHour(1, '12:30', '14:30');
    let subtracted = oh1.subtract(oh2);
    expect(subtracted[0].format()).toEqual('星期一 11:00 - 12:30');
    expect(subtracted[1].format()).toEqual('星期一 14:30 - 18:30');
    oh1 = new OpenHour(1, '11:00', '18:30');
    oh2 = new OpenHour(1, '11:00', '14:30');
    subtracted = oh1.subtract(oh2);
    expect(subtracted).toHaveLength(1);
    expect(subtracted[0].format()).toEqual('星期一 14:30 - 18:30');
    oh1 = new OpenHour(1, '11:00', '18:30');
    oh2 = new OpenHour(1, '12:30', '22:30');
    subtracted = oh1.subtract(oh2);
    expect(subtracted).toHaveLength(1);
    expect(subtracted[0].format()).toEqual('星期一 11:00 - 12:30');
    oh1 = new OpenHour(1, '11:00', '18:30');
    oh2 = new OpenHour(2, '12:30', '14:30');
    subtracted = oh1.subtract(oh2);
    expect(subtracted).toHaveLength(1);
    expect(subtracted[0].format()).toEqual('星期一 11:00 - 18:30');
  });  
});