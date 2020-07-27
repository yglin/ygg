import {
  TourPlanWithPlaysAndEquipments,
  TourPlanWithPlaysNoEquipment
} from '../tour-plan/sample-tour-plan';
import { Schedule, ServiceEvent } from '@ygg/schedule/core';
import {
  CellDefinesTourPlan,
  ScheduleAdapter,
  ImitationPlay,
  ImitationTourPlan,
  RelationshipScheduleEvent,
  RelationshipEquipment,
  ImitationEvent,
  RelationshipPlay,
  ImitationEventCellDefines
} from '@ygg/playwhat/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import {
  RelationPurchase,
  CellNames as CellNamesShopping
} from '@ygg/shopping/core';
import { find } from 'lodash';
import {
  PlaysWithEquipment,
  PlaysWithoutEquipment
} from '../play/sample-plays';
import {
  TheThing,
  TheThingRelation,
  RelationRecord
} from '@ygg/the-thing/core';

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
//         numParticipants: relation.getCellValue(CellNamesShopping.quantity)
//       }
//     );
//     ScheduleFromTourPlanWithPlaysAndEquipments.addEvent(event);
//   }
// }

export const TourPlanUnscheduled = TourPlanWithPlaysNoEquipment.clone();
TourPlanUnscheduled.name = `測試遊程(尚未規劃行程)_${Date.now()}`;
TourPlanUnscheduled.addCell(CellDefinesTourPlan.dayTimeRange.forgeCell());
ImitationTourPlan.setState(
  TourPlanUnscheduled,
  ImitationTourPlan.states.applied
);

export const ScheduledEvents: TheThing[] = [];
export const RelationPlayOfEvents: RelationRecord[] = [];

const dateRange = TourPlanUnscheduled.getCellValue(
  CellDefinesTourPlan.dateRange.name
);
export const ScheduleTrivial: Schedule = new Schedule(dateRange.toTimeRange(), {
  dayTimeRange: TourPlanUnscheduled.getCellValue(
    CellDefinesTourPlan.dayTimeRange.name
  )
});
for (const relation of TourPlanUnscheduled.getRelations(
  RelationPurchase.name
)) {
  const play = find(PlaysWithoutEquipment, p => p.id === relation.objectId);
  if (ImitationPlay.isValid(play)) {
    const event = new ServiceEvent(
      ScheduleAdapter.deduceServiceFromPlay(play),
      {
        numParticipants: relation.getCellValue(CellNamesShopping.quantity)
      }
    );
    ScheduleTrivial.addEvent(event);

    const eventThing = ImitationEvent.createTheThing(play);
    eventThing.name = play.name;
    eventThing.setCellValue(
      ImitationEventCellDefines.timeRange.name,
      event.timeRange
    );
    eventThing.setCellValue(
      ImitationEventCellDefines.numParticipants.name,
      event.numParticipants
    );
    eventThing.addRelation(
      RelationshipPlay.createRelation(eventThing.id, play.id)
    );
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
