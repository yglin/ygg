import { TourPlanWithPlaysAndEquipments } from '../tour-plan/sample-tour-plan';
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
import { PlaysWithEquipment } from '../play/sample-plays';

const dateRange: DateRange = TourPlanWithPlaysAndEquipments.getCellValue(
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
