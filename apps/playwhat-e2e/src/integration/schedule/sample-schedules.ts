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
  RelationshipEquipment
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
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';

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
TourPlanUnscheduled.name = '測試遊程(尚未規劃行程)';
TourPlanUnscheduled.addCell(CellDefinesTourPlan.dayTimeRange.forgeCell());
ImitationTourPlan.setState(
  TourPlanUnscheduled,
  ImitationTourPlan.states.applied
);

export const ScheduledEvents: TheThing[] = [];

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
    ScheduledEvents.push(ScheduleAdapter.deriveEventFromServiceEvent(event));
  }
}

export const TourPlanScheduled = TourPlanUnscheduled.clone();
TourPlanScheduled.name = '測試遊程(已規劃行程)';
ImitationTourPlan.setState(TourPlanScheduled, ImitationTourPlan.states.applied);
TourPlanScheduled.setRelation(
  RelationshipScheduleEvent.name,
  ScheduledEvents.map(ev =>
    RelationshipScheduleEvent.createRelation(TourPlanScheduled.id, ev.id)
  )
);

export const TourPlanScheduledOneEvent = TourPlanScheduled.clone();
TourPlanScheduledOneEvent.name = '測試遊程(已規劃行程，一個事件)';
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
