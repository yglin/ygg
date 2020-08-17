import { Injectable } from '@angular/core';
import { ScheduleAdapter } from '@ygg/playwhat/core';
import {
  RelationFactoryService,
  TheThingAccessService
} from '@ygg/the-thing/ui';
import { EventFactoryService } from './event-factory.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdapterService extends ScheduleAdapter {
  constructor(
    eventFactory: EventFactoryService,
    theThingAccessor: TheThingAccessService,
    relationFactory: RelationFactoryService
  ) {
    super(eventFactory, theThingAccessor, relationFactory);
  }
}
