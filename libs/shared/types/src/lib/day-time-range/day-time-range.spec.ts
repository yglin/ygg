import { DayTimeRange } from "./day-time-range";

describe('class DayTimeRange', () => {
  it('should automatically justify its start and end order', () => {
    const tr = new DayTimeRange('18:00', '06:00');
    expect(tr.format('HH:mm')).toEqual('06:00 - 18:00');
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