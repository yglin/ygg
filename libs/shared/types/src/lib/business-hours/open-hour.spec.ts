import { OpenHour } from "./open-hour";

describe('class OpenHour', () => {
  it('can merged 2 intersected open-hours', () => {
    const oh1 = new OpenHour(1, '11:00', '15:30');
    const oh2 = new OpenHour(1, '12:30', '17:00');
    const merged = oh1.merge(oh2);
    expect(merged.format()).toEqual('1 11:00 - 17:00');
  });

  it('can subtract open-hour and split', () => {
    const oh1 = new OpenHour(1, '11:00', '18:30');
    const oh2 = new OpenHour(1, '12:30', '14:30');
    const subtracted = oh1.subtract(oh2);
    expect(subtracted[0].format()).toEqual('1 11:00 - 12:30');
    expect(subtracted[1].format()).toEqual('1 14:30 - 18:30');
  });  
});