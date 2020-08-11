import {
  CellDefinesTourPlan,
  ImitationEvent,
  ImitationEventCellDefines,
  ImitationPlay,
  ImitationTourPlan,
  RelationshipPlay,
  RelationshipScheduleEvent,
  ScheduleAdapter
} from '@ygg/playwhat/core';
import { Schedule, ServiceEvent } from '@ygg/schedule/core';
import { RelationPurchase, ShoppingCellDefines } from '@ygg/shopping/core';
import { RelationRecord, TheThing } from '@ygg/the-thing/core';
import { find } from 'lodash';
import { PlaysWithoutEquipment } from '../play/sample-plays';
import { TourPlanWithPlaysNoEquipment } from '../tour-plan/sample-tour-plan';

// let dateRange: DateRange = TourPlanWithPlaysAndEquipments.getCellValue(
//   CellDefinesTourPlan.dateRange.name
// );
// export const ScheduleFromTourPlanWithPlaysAndEquipments: Schedule = new Schedule(
//   dateRange.toTimeRange()
// );
// for (const relation of TourPlanWithPlaysAndEquipments.getRelations(
//   RelationPurchase.name
// )) {
//   const play = find(PlaysWithEquipment, p => p.id === relation.objectId);
//   if (ImitationPlay.isValid(play)) {
//     const event = new ServiceEvent(
//       ScheduleAdapter.deduceServiceFromPlay(play),
//       {
//         numParticipants: relation.getCellValue(CellIdsShopping.quantity)
//       }
//     );
//     ScheduleFromTourPlanWithPlaysAndEquipments.addEvent(event);
//   }
// }

console.log(TourPlanWithPlaysNoEquipment);
export const TourPlanUnscheduled = TourPlanWithPlaysNoEquipment.clone();
TourPlanUnscheduled.name = `測試遊程(尚未規劃行程)_${Date.now()}`;
TourPlanUnscheduled.upsertCell(CellDefinesTourPlan.dayTimeRange.forgeCell());
ImitationTourPlan.setState(
  TourPlanUnscheduled,
  ImitationTourPlan.states.applied
);

export const ScheduledEvents: TheThing[] = [];
export const RelationPlayOfEvents: RelationRecord[] = [];

const dateRange = TourPlanUnscheduled.getCellValue(
  CellDefinesTourPlan.dateRange.id
);
export const ScheduleTrivial: Schedule = new Schedule(dateRange.toTimeRange(), {
  dayTimeRange: TourPlanUnscheduled.getCellValue(
    CellDefinesTourPlan.dayTimeRange.id
  )
});
for (const relation of TourPlanUnscheduled.getRelations(
  RelationPurchase.name
)) {
  console.log(relation);
  const play = find(PlaysWithoutEquipment, p => p.id === relation.objectId);
  if (ImitationPlay.isValid(play)) {
    const event = new ServiceEvent(
      ScheduleAdapter.deduceServiceFromPlay(play),
      {
        numParticipants: relation.getCellValue(ShoppingCellDefines.quantity.id)
      }
    );
    ScheduleTrivial.addEvent(event);

    const eventThing = ImitationEvent.createTheThing(play);
    eventThing.name = play.name;
    eventThing.setCellValue(
      ImitationEventCellDefines.timeRange.id,
      event.timeRange
    );
    eventThing.setCellValue(
      ImitationEventCellDefines.numParticipants.id,
      event.numParticipants
    );
    eventThing.addRelation(
      RelationshipPlay.createRelation(eventThing.id, play.id)
    );
    console.log(eventThing);
    ScheduledEvents.push(eventThing);

    RelationPlayOfEvents.push(
      new RelationRecord({
        subjectCollection: ImitationEvent.collection,
        subjectId: event.id,
        objectCollection: ImitationPlay.collection,
        objectId: play.id,
        objectRole: RelationshipPlay.name
      })
    );
  }
}

export const TourPlanScheduled = TourPlanUnscheduled.clone();
TourPlanScheduled.name = `測試遊程(已規劃行程)_${Date.now()}`;
ImitationTourPlan.setState(TourPlanScheduled, ImitationTourPlan.states.applied);
TourPlanScheduled.setRelation(
  RelationshipScheduleEvent.name,
  ScheduledEvents.map(ev =>
    RelationshipScheduleEvent.createRelation(TourPlanScheduled.id, ev.id)
  )
);

export const TourPlanScheduledOneEvent = TourPlanScheduled.clone();
TourPlanScheduledOneEvent.name = `測試遊程(已規劃行程，一個活動事件)_${Date.now()}`;
ImitationTourPlan.setState(
  TourPlanScheduledOneEvent,
  ImitationTourPlan.states.applied
);
TourPlanScheduledOneEvent.setRelation(RelationshipScheduleEvent.name, [
  RelationshipScheduleEvent.createRelation(
    TourPlanScheduledOneEvent.id,
    ScheduledEvents[0].id
  )
]);

export const TourPlanScheduled3Events = TourPlanScheduled.clone();
TourPlanScheduled3Events.name = `測試遊程(已規劃行程，三個活動事件)_${Date.now()}`;
ImitationTourPlan.setState(
  TourPlanScheduled3Events,
  ImitationTourPlan.states.applied
);
TourPlanScheduled3Events.setRelation(
  RelationshipScheduleEvent.name,
  ScheduledEvents.slice(0, 3).map(ev =>
    RelationshipScheduleEvent.createRelation(TourPlanScheduled3Events.id, ev.id)
  )
);
