import { Emcee } from '@ygg/shared/infra/core';
import {
  RelationFactory,
  RelationRecord,
  TheThing,
  TheThingAccessor,
  TheThingFactory
} from '@ygg/the-thing/core';
import { every } from 'lodash';
import { switchMap, take } from 'rxjs/operators';
import {
  ImitationEvent,
  ImitationTourPlan,
  RelationshipScheduleEvent
} from '../imitations';

export class TourPlanFactory {
  constructor(
    protected emcee: Emcee,
    protected theThingAccessor: TheThingAccessor,
    protected theThingFactory: TheThingFactory,
    protected relationFactory: RelationFactory
  ) {}

  async getEvents(tourPlanId: string): Promise<TheThing[]> {
    return this.relationFactory
      .findBySubjectAndRole$(tourPlanId, RelationshipScheduleEvent.name)
      .pipe(
        switchMap((relations: RelationRecord[]) =>
          this.theThingAccessor.listByIds$(
            relations.map(r => r.objectId),
            ImitationEvent.collection
          )
        ),
        take(1)
      )
      .toPromise();
  }

  async checkApproval(tourPlanId: string) {
    try {
      const tourPlan = await this.theThingAccessor.load(
        tourPlanId,
        ImitationTourPlan.collection
      );
      const events: TheThing[] = await this.getEvents(tourPlanId);
      // console.log(events);
      const allApproved: boolean = every(
        events.map(ev => {
          const isApproved = ImitationEvent.isState(
            ev,
            ImitationEvent.states['host-approved']
          );
          // console.log(`Is event ${ev.name} host approved? ${isApproved}`);
          return isApproved;
        })
      );
      if (allApproved) {
        // console.log(`All events of tour-plan ${tourPlan.name} approved `);
        await this.theThingFactory.setState(
          tourPlan,
          ImitationTourPlan,
          ImitationTourPlan.states['approved']
        );
      }
    } catch (error) {
      await this.emcee.error(
        `任務失敗：檢查所有行程的負責人確認參加，錯誤原因：${error.message}`
      );
      return Promise.reject();
    }
  }
}
