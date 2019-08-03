import { TimeRange } from "./time-range";

describe('class TimeRange', () => {
  it('can merge 2 intersected time ranges', () => {
    const tr1 = new TimeRange('08:30', '11:00');
    const tr2 = new TimeRange('10:00', '12:00');
    const merged = tr1.merge(tr2);
    expect(merged.format('HH:mm', 'HH:mm')).toEqual('08:30 - 12:00');
  });
});