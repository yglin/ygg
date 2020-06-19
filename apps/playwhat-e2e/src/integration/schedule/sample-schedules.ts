import { TourPlanWithPlaysAndEquipments, TourPlanWithPlaysNoEquipment } from '../tour-plan/sample-tour-plan';
import { Schedule, ServiceEvent } from '@ygg/schedule/core';
import {
  CellDefinesTourPlan,
  ScheduleAdapter,
  ImitationPlay
} from '@ygg/playwhat/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import {
  RelationPurchase,
  CellNames as CellNamesShopping
} from '@ygg/shopping/core';
import { find } from 'lodash';
import { PlaysWithEquipment, PlaysWithoutEquipment } from '../play/sample-plays';

let dateRange: DateRange = TourPlanWithPlaysAndEquipments.getCellValue(
  CellDefinesTourPlan.dateRange.name
);
export const ScheduleFromTourPlanWithPlaysAndEquipments: Schedule = new Schedule(
  dateRange.toTimeRange()
);
for (const relation of TourPlanWithPlaysAndEquipments.getRelations(
  RelationPurchase.name
)) {
  const play = find(PlaysWithEquipment, p => p.id === relation.objectId);
  if (ImitationPlay.isValid(play)) {
    const event = new ServiceEvent(
      ScheduleAdapter.deduceServiceFromPlay(play),
      {
        numParticipants: relation.getCellValue(CellNamesShopping.quantity)
      }
    );
    ScheduleFromTourPlanWithPlaysAndEquipments.addEvent(event);
  }
}

dateRange = TourPlanWithPlaysNoEquipment.getCellValue(
  CellDefinesTourPlan.dateRange.name
);
export const ScheduleFromTourPlanWithPlaysNoEquipment: Schedule = new Schedule(
  dateRange.toTimeRange()
);
for (const relation of TourPlanWithPlaysNoEquipment.getRelations(
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
    ScheduleFromTourPlanWithPlaysNoEquipment.addEvent(event);
  }
}
