import {
  Schedule,
  Service,
  ServiceEvent,
  ServiceAvailablility
} from '@ygg/schedule/core';
import {
  DateRange,
  TimeRange,
  OmniTypes,
  BusinessHours
} from '@ygg/shared/omni-types/core';
import {
  CellNames as CellNamesShopping,
  RelationPurchase
} from '@ygg/shopping/core';
import {
  TheThing,
  TheThingAccessor,
  TheThingRelation,
  RelationFactory,
  RelationRecord,
  TheThingFilter
} from '@ygg/the-thing/core';
import {
  ImitationEvent,
  ImitationEventCellDefines,
  RelationshipPlay
} from '../imitations';
import { ImitationPlay, ImitationPlayCellDefines } from '../play';
import { CellDefinesTourPlan, ImitationTourPlan } from '../tour-plan';
import { map, take, switchMap, filter, catchError } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { of, Observable, throwError } from 'rxjs';

export class ScheduleAdapter {
  static deriveEventFromServiceEvent(serviceEvent: ServiceEvent): TheThing {
    const event = ImitationEvent.createTheThing();
    event.id = serviceEvent.id;
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

  constructor(
    protected theThingAccessor: TheThingAccessor,
    protected relationFactory: RelationFactory
  ) {}

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
      const play = await this.theThingAccessor.get(purchase.objectId);
      if (ImitationPlay.isValid(play)) {
        const service = ScheduleAdapter.deduceServiceFromPlay(play);
        const event = new ServiceEvent(service, {
          numParticipants: purchase.getCellValue(CellNamesShopping.quantity)
        });
        if (event) {
          schedule.addEvent(event);
        }
        if (!(play.id in schedule.serviceAvailabilities$)) {
          schedule.serviceAvailabilities$[
            play.id
          ] = this.deduceServiceAvailability$(
            play.id,
            schedule.timeRange,
            play.getCellValue(ImitationPlayCellDefines.maxParticipants.name),
            play.getCellValue(ImitationPlayCellDefines.businessHours.name)
          );
        }
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

  async deriveEventsFromSchedule(schedule: Schedule): Promise<TheThing[]> {
    const events: TheThing[] = [];
    for (const serviceEvent of schedule.events) {
      const event = ScheduleAdapter.deriveEventFromServiceEvent(serviceEvent);
      events.push(event);
    }
    return events;
  }

  deduceServiceAvailability$(
    serviceId: string,
    timeRange: TimeRange,
    capacity: number,
    businessHours?: BusinessHours
  ): Observable<ServiceAvailablility> {
    return this.relationFactory
      .findByObjectAndRole$(serviceId, RelationshipPlay.name)
      .pipe(
        switchMap((relations: RelationRecord[]) => {
          if (isEmpty(relations)) {
            return of([]);
          } else {
            const eventFilter: TheThingFilter = ImitationEvent.filter;
            eventFilter.addState(
              ImitationEvent.stateName,
              ImitationEvent.states['host-approved'].value
            );
            eventFilter.ids = relations.map(r => r.subjectId);
            eventFilter.addCellFilter(
              ImitationEventCellDefines.timeRange.name,
              OmniTypes['time-range'].matchers.in,
              timeRange
            );
            return this.theThingAccessor.listByFilter$(
              eventFilter,
              ImitationEvent.collection
            );
          }
        }),
        map((events: TheThing[]) => {
          const serviceAvailablility = new ServiceAvailablility(serviceId, {
            timeRange,
            capacity
          });
          if (businessHours) {
            serviceAvailablility.mergeBusinessHours(businessHours);
          }
          for (const event of events) {
            serviceAvailablility.addOccupancy(
              event.getCellValue(ImitationEventCellDefines.timeRange.name),
              event.getCellValue(ImitationEventCellDefines.numParticipants.name)
            );
          }
          return serviceAvailablility;
        }),
        catchError(error => {
          console.error(error);
          return throwError(
            new Error(
              `Failed to deduce service availability from service ${serviceId}\n ${error.message}`
            )
          );
        })
      );
  }

  // async attachScheduleWithTourPlan(tourPlan: TheThing, schedule: Schedule) {
  //   const relations: TheThingRelation[] = [];
  //   const events = this.deriveEventsFromSchedule(schedule);
  //   for (const serviceEvent of schedule.events) {
  //     const event = ScheduleAdapter.deriveEventFromServiceEvent(serviceEvent);
  //     events.push(event);
  //     await this.theThingAccessor.save(event);
  //     const relation = RelationshipScheduleEvent.createRelation(
  //       tourPlan.id,
  //       event.id
  //     );
  //     relations.push(relation);
  //   }
  //   tourPlan.setRelation(RelationshipScheduleEvent.name, relations);
  // }
}
