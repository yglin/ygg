import { TimeRange } from "./time-range";

describe('class TimeRange', () => {
  it('should automatically justify its start and end order', () => {
    const tr = new TimeRange('18:00', '06:00');
    expect(tr.format('HH:mm')).toEqual('06:00 - 18:00');
  });
  
  it('can merge 2 intersected time ranges', () => {
    const tr1 = new TimeRange('08:30', '11:00');
    const tr2 = new TimeRange('10:00', '12:00');
    const merged = tr1.merge(tr2);
    expect(merged.format('HH:mm', 'HH:mm')).toEqual('08:30 - 12:00');
  });

  it('can subtract time range into 2', () => {
    const tr1 = new TimeRange('08:30', '15:00');
    const tr2 = new TimeRange('10:00', '12:00');
    const subtracted = tr1.subtract(tr2);
    expect(subtracted[0].format('HH:mm')).toEqual('08:30 - 10:00');
    expect(subtracted[1].format('HH:mm')).toEqual('12:00 - 15:00');    
  });  
});