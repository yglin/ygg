import * as functions from 'firebase-functions';
import { ImitationEvent, RelationshipScheduleEvent } from '@ygg/playwhat/core';
import { TheThing } from '@ygg/the-thing/core';
import { take } from 'rxjs/operators';
import { relationFactory } from '@ygg/the-thing/functions';
import { tourPlanFactory } from '../factories';

// const InvitationCollection = 'invitations';
export const onEventApprovalOfHost = functions.firestore
  .document(`${ImitationEvent.collection}/{id}`)
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
          await tourPlanFactory.checkApproval(relationRecord.subjectId);
          // console.log(
          //   `Done checking approval of tour-plan ${relationRecord.subjectId}`
          // );
        }
      }
      return Promise.resolve();
    } catch (error) {
      console.error(error.message);
      return Promise.reject();
    }
  });
