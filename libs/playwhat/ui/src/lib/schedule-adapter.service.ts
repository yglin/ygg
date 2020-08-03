import { Injectable } from '@angular/core';
import { ScheduleAdapter } from '@ygg/playwhat/core';
import {
  RelationFactoryService,
  TheThingAccessService
} from '@ygg/the-thing/ui';

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
