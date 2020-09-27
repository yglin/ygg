import {
  ImitationTourPlanCellDefines,
  ImitationEvent,
  ImitationEventCellDefines,
  ImitationPlay,
  ImitationTourPlan,
  RelationshipEventService,
  RelationshipScheduleEvent,
  ScheduleAdapter
} from '@ygg/playwhat/core';
import { Schedule, ServiceEvent } from '@ygg/schedule/core';
import { RelationPurchase, ShoppingCellDefines } from '@ygg/shopping/core';
import { RelationRecord, TheThing } from '@ygg/the-thing/core';
import { find } from 'lodash';
import { PlaysWithoutEquipment, SamplePlays } from '../play/sample-plays';
import { TourPlanWithPlaysNoEquipment } from '../tour-plan/sample-tour-plan';
import { DayTimeRange, DayTime } from '@ygg/shared/omni-types/core';

// let dateRange: DateRange = TourPlanWithPlaysAndEquipments.getCellValue(
//   ImitationTourPlanCellDefines.dateRange.name
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

// console.log(TourPlanWithPlaysNoEquipment);
export const TourPlanUnscheduled = TourPlanWithPlaysNoEquipment.clone();
TourPlanUnscheduled.name = `測試遊程(尚未規劃行程)_${Date.now()}`;
TourPlanUnscheduled.upsertCell(
  ImitationTourPlanCellDefines.dayTimeRange.createCell(
    new DayTimeRange(new DayTime(7, 30), new DayTime(18, 0))
  )
);
ImitationTourPlan.setState(
  TourPlanUnscheduled,
  ImitationTourPlan.states.applied
);

export const TourPlanUnscheduledOnePlay = TourPlanUnscheduled.clone();
TourPlanUnscheduledOnePlay.setRelation(
  RelationPurchase.name,
  TourPlanUnscheduled.getRelations(RelationPurchase.name).slice(0, 1)
);
TourPlanUnscheduledOnePlay.name = `測試遊程(尚未規劃行程，一個體驗)_${Date.now()}`;
ImitationTourPlan.setState(
  TourPlanUnscheduledOnePlay,
  ImitationTourPlan.states.applied
);

export const ScheduledEvents: TheThing[] = [];

const dateRange = TourPlanUnscheduled.getCellValue(
  ImitationTourPlanCellDefines.dateRange.id
);
export const ScheduleTrivial: Schedule = new Schedule(dateRange.toTimeRange(), {
  dayTimeRange: TourPlanUnscheduled.getCellValue(
    ImitationTourPlanCellDefines.dayTimeRange.id
  )
});
for (const relation of TourPlanUnscheduled.getRelations(
  RelationPurchase.name
)) {
  // console.log(relation);
  const play = find(PlaysWithoutEquipment, p => p.id === relation.objectId);
  if (ImitationPlay.isValid(play)) {
    const tEvent = ImitationEvent.createTheThing(play);
    tEvent.name = play.name;
    tEvent.setCellValue(
      ImitationEventCellDefines.numParticipants.id,
      relation.getCellValue(ShoppingCellDefines.quantity.id)
    );
    tEvent.addRelation(
      RelationshipEventService.createRelation(tEvent.id, play.id)
    );
    // console.log(tEvent);
    ScheduledEvents.push(tEvent);

    const sEvent = ScheduleAdapter.fromTheThingEventToServiceEvent(
      tEvent,
      play
    );
    ScheduleTrivial.addEvent(sEvent);
  }
}

ScheduleTrivial.stupidSchedule();
for (const sEvent of ScheduleTrivial.events) {
  const tEvent = find(ScheduledEvents, ev => ev.id === sEvent.id);
  if (tEvent) {
    tEvent.upsertCell(
      ImitationEventCellDefines.timeRange.createCell(sEvent.timeRange)
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
const onePlay = find(SamplePlays, p =>
  TourPlanUnscheduledOnePlay.hasRelationTo(RelationPurchase.name, p.id)
);
const oneEvent = find(ScheduledEvents, ev =>
  ev.hasRelationTo(RelationshipEventService.name, onePlay.id)
);
TourPlanScheduledOneEvent.setRelation(RelationshipScheduleEvent.name, [
  RelationshipScheduleEvent.createRelation(
    TourPlanScheduledOneEvent.id,
    oneEvent.id
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
