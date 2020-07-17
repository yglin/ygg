import { Injectable } from '@angular/core';
import { ScheduleAdapter, ImitationTourPlan } from '@ygg/playwhat/core';
import { TheThing } from '@ygg/the-thing/core';
import { Schedule, Service } from '@ygg/schedule/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import {
  TheThingFactoryService,
  RelationFactoryService
} from '@ygg/the-thing/ui';
import { TimeRange } from '@ygg/shared/omni-types/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdapterService extends ScheduleAdapter {
  constructor(
    theThingAccessor: TheThingAccessService,
    relationFactory: RelationFactoryService
  ) {
    super(theThingAccessor, relationFactory);
  }
}
