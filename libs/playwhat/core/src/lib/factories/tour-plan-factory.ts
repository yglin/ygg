import { Emcee } from '@ygg/shared/infra/core';
import {
  RelationFactory,
  RelationRecord,
  TheThing,
  TheThingAccessor,
  TheThingFactory,
  TheThingFactoryBasic
} from '@ygg/the-thing/core';
import { every } from 'lodash';
import { switchMap, take } from 'rxjs/operators';
import {
  ImitationEvent,
  ImitationTourPlan,
  RelationshipScheduleEvent
} from '../imitations';

export class TourPlanFactoryBasic {
  constructor(protected theThingAccessor: TheThingAccessor) {}

  async getEvents(tourPlanId: string): Promise<TheThing[]> {
    try {
      const tourPlan = await this.theThingAccessor.load(
        tourPlanId,
        ImitationTourPlan.collection
      );
      const eventIds = tourPlan.getRelationObjectIds(
        RelationshipScheduleEvent.name
      );
      return this.theThingAccessor.listByIds(
        eventIds,
        ImitationEvent.collection
      );
    } catch (error) {
      const wrapError = new Error(
        `Failed to get events from tour-plan ${tourPlanId}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  async checkApproval(tourPlanId: string): Promise<boolean> {
    try {
      const tourPlan = await this.theThingAccessor.load(
        tourPlanId,
        ImitationTourPlan.collection
      );
      const events: TheThing[] = await this.getEvents(tourPlanId);
      // console.log(events);
      return every(
        events.map(ev => {
          const isApproved = ImitationEvent.isState(
            ev,
            ImitationEvent.states['host-approved']
          );
          // console.log(`Is event ${ev.name} host approved? ${isApproved}`);
          return isApproved;
        })
      );
    } catch (error) {
      const wrapError = new Error(
        `Failed to check approval of tour-plan ${tourPlanId}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }
}

export class TourPlanFactory extends TourPlanFactoryBasic {
  constructor(theThingAccessor: TheThingAccessor) {
    super(theThingAccessor);
  }
}
