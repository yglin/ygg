import { Injectable } from '@angular/core';
import { ScheduleAdapter, ImitationTourPlan } from '@ygg/playwhat/core';
import { TheThing } from '@ygg/the-thing/core';
import { Schedule } from '@ygg/schedule/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdapterService extends ScheduleAdapter {
  constructor(theThingAccessor: TheThingAccessService) {
    super(theThingAccessor);
  }
}
