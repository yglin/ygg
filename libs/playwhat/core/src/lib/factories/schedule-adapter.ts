import {
  TheThing,
  TheThingRelation,
  TheThingAccessor
} from '@ygg/the-thing/core';

import { Schedule, ServiceEvent, Service } from '@ygg/schedule/core';
import {
  ImitationTourPlan,
  CellDefinesTourPlan,
  RelationshipScheduleEvent
} from '../tour-plan';
import { DateRange } from '@ygg/shared/omni-types/core';
import {
  RelationPurchase,
  CellNames as CellNamesShopping
} from '@ygg/shopping/core';
import { ImitationPlay, ImitationPlayCellDefines } from '../play';
import {
  ImitationEvent,
  RelationshipPlay,
  ImitationEventCellDefines
} from '../imitations';

export class ScheduleAdapter {
  static deriveEventFromServiceEvent(serviceEvent: ServiceEvent): TheThing {
    const event = ImitationEvent.createTheThing();
    event.name = serviceEvent.service.name;
    event.image = serviceEvent.service.image;
    event.setCellValue(
      ImitationEventCellDefines.timeRange.name,
      serviceEvent.timeRange
    );
    event.setCellValue(
      ImitationEventCellDefines.numParticipants.name,
      serviceEvent.numParticipants
    );
    event.addRelation(
      RelationshipPlay.createRelation(event.id, serviceEvent.service.id)
    );
    // console.log('deriveEventFromServiceEvent');
    // console.log(event);
    return event;
  }

  static deduceServiceFromPlay(play: TheThing): Service {
    const service = new Service();
    service.id = play.id;
    service.image = play.image;
    service.name = play.name;
    service.timeLength = play.getCellValue(
      ImitationPlayCellDefines.timeLength.name
    );
    service.minParticipants = play.getCellValue(
      ImitationPlayCellDefines.minParticipants.name
    );
    service.maxParticipants = play.getCellValue(
      ImitationPlayCellDefines.maxParticipants.name
    );
    service.location = play.getCellValue(
      ImitationPlayCellDefines.location.name
    );
    service.businessHours = play.getCellValue(
      ImitationPlayCellDefines.businessHours.name
    );
    return service;
  }

  constructor(protected theThingAccessor: TheThingAccessor) {}

  async deduceScheduleFromTourPlan(tourPlan: TheThing): Promise<Schedule> {
    if (!ImitationTourPlan.isValid(tourPlan)) {
      throw new Error(`Not a valid tour plan: ${JSON.stringify(tourPlan)}`);
    }
    const dateRange: DateRange = tourPlan.getCellValue(
      CellDefinesTourPlan.dateRange.name
    );
    const schedule = new Schedule(dateRange.toTimeRange(), {
      dayTimeRange: tourPlan.getCellValue(CellDefinesTourPlan.dayTimeRange.name)
    });
    const purchaseRelations = tourPlan.getRelations(RelationPurchase.name);
    for (const purchase of purchaseRelations) {
      const event: ServiceEvent = await this.deduceEventFromPurchase(purchase);
      if (event) {
        schedule.addEvent(event);
      }
    }
    return schedule;
  }

  async deduceEventFromPurchase(
    purchase: TheThingRelation
  ): Promise<ServiceEvent> {
    const play = await this.theThingAccessor.get(purchase.objectId);
    if (!ImitationPlay.isValid(play)) {
      return null;
    }
    const service = ScheduleAdapter.deduceServiceFromPlay(play);
    const event = new ServiceEvent(service, {
      numParticipants: purchase.getCellValue(CellNamesShopping.quantity)
    });
    return event;
  }

  async attachScheduleWithTourPlan(tourPlan: TheThing, schedule: Schedule) {
    const events: TheThing[] = [];
    const relations: TheThingRelation[] = [];
    for (const serviceEvent of schedule.events) {
      const event = ScheduleAdapter.deriveEventFromServiceEvent(serviceEvent);
      events.push(event);
      await this.theThingAccessor.save(event);
      const relation = RelationshipScheduleEvent.createRelation(
        tourPlan.id,
        event.id
      );
      relations.push(relation);
    }
    tourPlan.setRelation(RelationshipScheduleEvent.name, relations);
  }
}
