import { ImitationTourPlan } from '@ygg/playwhat/core';
import { User } from '@ygg/shared/user/core';
import { userAccessor, notificationFactory } from '@ygg/shared/user/functions';
import { TheThing } from '@ygg/the-thing/core';
import * as functions from 'firebase-functions';

// const notificationFactory: NotificationFactory;

// const NotificationCollection = 'notifications';
export const onTourPlanStateApproved = functions.firestore
  .document(`${ImitationTourPlan.collection}/{id}`)
  .onUpdate(async (change, context) => {
    const tourPlanBefore: TheThing = TheThing.deserializerJSON(
      change.before.data()
    );
    const tourPlanAfter: TheThing = TheThing.deserializerJSON(
      change.after.data()
    );
    try {
      if (
        !ImitationTourPlan.isState(
          tourPlanBefore,
          ImitationTourPlan.states['approved']
        ) &&
        ImitationTourPlan.isState(
          tourPlanAfter,
          ImitationTourPlan.states['approved']
        )
      ) {
        const owner: User = await userAccessor.get(tourPlanAfter.ownerId);
        if (!owner) {
          throw new Error(
            `Can not find owner of tour-plan ${tourPlanAfter.id}`
          );
        }
        notificationFactory.create({
          type: 'tour-plan-approved',
          inviterId: owner.id,
          email: owner.email,
          mailSubject: `您的遊程：${tourPlanAfter.name} 已確認可成行`,
          mailContent: `您的遊程：${tourPlanAfter.name} 已確認可成行，可以開始付款流程。`,
          landingUrl: `${ImitationTourPlan.routePath}/${tourPlanAfter.id}`,
          confirmMessage: `<h3>您的遊程：${tourPlanAfter.name} 已確認可成行，前往遊程檢視頁面。</h3>`,
          data: {}
        });
      }
      return Promise.resolve();
    } catch (error) {
      console.error(error.message);
      return Promise.reject();
    }
  });
