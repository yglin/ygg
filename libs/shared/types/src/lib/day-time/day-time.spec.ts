import { random } from "lodash";
import { DayTime } from "./day-time";

import * as moment from "moment";

describe('class DayTime', () => {
  it('constructor should accept only hour and minute', () => {
    const hour = random(0, 23);
    const minute = random(0, 59);
    const dayTime = new DayTime(hour, minute);
    expect(dayTime.format()).toEqual(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
  });

  it('should auto clamp hour to (0, 23); minute to (0, 59)', () => {
    let dayTime = new DayTime(-3, -20);
    expect(dayTime.format()).toEqual(`00:00`);
    dayTime = new DayTime(24, 60);
    expect(dayTime.format()).toEqual(`23:59`);
  });
});