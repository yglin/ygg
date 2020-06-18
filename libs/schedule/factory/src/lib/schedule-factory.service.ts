import { Injectable } from '@angular/core';
import { SchedulePlan, ScheduleFactory, Schedule } from '@ygg/schedule/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleFactoryService extends ScheduleFactory {

  constructor() {
    super();
  }

  async createSchedule(schedulePlan: SchedulePlan): Promise<Schedule> {
    // TODO: implement
    return new Schedule();
  }
}
