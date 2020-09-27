import * as functions from 'firebase-functions';
import {
  ImitationEvent,
  ImitationTourPlan,
  RelationshipScheduleEvent
} from '@ygg/playwhat/core';
import { TheThing } from '@ygg/the-thing/core';
import { take } from 'rxjs/operators';
import {
  relationFactory,
  theThingAccessor,
  theThingFactory
} from '@ygg/the-thing/functions';
import { tourPlanFactory } from '../factories';
import { getEnv } from '@ygg/shared/infra/core';

const firebaseEnv = getEnv('firebase');

// const NotificationCollection = 'notifications';
export const onEventApprovalOfHost = functions
  .region(firebaseEnv.region)
  .firestore.document(`${ImitationEvent.collection}/{id}`)
  .onUpdate(async (change, context) => {
    // console.log('HI~!! MAMA!!!');
    const eventBefore = TheThing.deserializerJSON(change.before.data());
    const eventAfter = TheThing.deserializerJSON(change.after.data());
    // console.log(eventBefore);
    // console.log(eventAfter);
    try {
      if (
        !ImitationEvent.isState(
          eventBefore,
          ImitationEvent.states['host-approved']
        ) &&
        ImitationEvent.isState(
          eventAfter,
          ImitationEvent.states['host-approved']
        )
      ) {
        // console.log(`Event ${context.params.id} approved by host`);
        const relationsOfTourPlan = await relationFactory
          .findByObjectAndRole$(
            context.params.id,
            RelationshipScheduleEvent.name
          )
          .pipe(take(1))
          .toPromise();
        // console.log(
        //   `Found related tour-plans:\n${relationsOfTourPlan
        //     .map(r => r.id)
        //     .join('\n')}`
        // );
        for (const relationRecord of relationsOfTourPlan) {
          const allEventsApproved = await tourPlanFactory.checkApproval(
            relationRecord.subjectId
          );
          if (allEventsApproved) {
            const tourPlan = await theThingAccessor.load(
              relationRecord.subjectId,
              ImitationTourPlan.collection
            );
            await theThingFactory.setState(
              tourPlan,
              ImitationTourPlan,
              ImitationTourPlan.states['approved']
            );
          }
          // console.log(
          //   `Done checking approval of tour-plan ${relationRecord.subjectId}`
          // );
        }
      }
      return Promise.resolve();
    } catch (error) {
      const wrapError = new Error(
        `Failed to check approve of parent tour-plan of event ${context.params.id}.\n${error.message}`
      );
      console.error(wrapError.message);
      return Promise.reject(wrapError);
    }
  });
