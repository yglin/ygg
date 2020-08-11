import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { DateRange, DayTimeRange, Contact } from '@ygg/shared/omni-types/core';
import { randomBytes } from 'crypto';
import { random, find, omit, pick } from 'lodash';
import {
  SamplePlays,
  SampleEquipments,
  PlaysWithoutEquipment,
  PlaysWithEquipment
} from '../play/sample-plays';
import { RelationPurchase, Purchase, ImitationOrder } from '@ygg/shopping/core';
import {
  RelationshipEquipment,
  ImitationTourPlan,
  ImitationTourPlanCellDefines,
} from '@ygg/playwhat/core';
import * as moment from 'moment';

const dateRange = DateRange.forge();
export const MinimalTourPlan = ImitationTourPlan.createTheThing().fromJSON({
  name: `測試遊程(最少需求資料)_${Date.now()}`,
  view: 'tour-plan',
  cells: [
    ImitationTourPlanCellDefines.dateRange.createCell(dateRange.toJSON()),
    ImitationTourPlanCellDefines.numParticipants.createCell(random(3, 100)),
    ImitationTourPlanCellDefines.contact.createCell(Contact.forge())
  ]
});

export const MinimalTourPlanWithoutName = MinimalTourPlan.clone();
delete MinimalTourPlanWithoutName.name;

export const TourPlanFull = MinimalTourPlan.clone();
TourPlanFull.name = `測試遊程(完整資料欄位)_${Date.now()}`;
TourPlanFull.setState(
  ImitationTourPlan.stateName,
  ImitationTourPlan.states.new
);
TourPlanFull.upsertCells(
  [
    ImitationTourPlanCellDefines.dayTimeRange.createCell(DayTimeRange.forge().toJSON()),
    ImitationTourPlanCellDefines.aboutMeals.createCell('本團吃全素'),
    ImitationTourPlanCellDefines.aboutTransport.createCell('請幫忙代租一台十人的小巴士'),
    ImitationTourPlanCellDefines.numElders.createCell(7),
    ImitationTourPlanCellDefines.numKids.createCell(5),
    ImitationTourPlanCellDefines.numPartTimes.createCell(2),
    ImitationTourPlanCellDefines.miscNotes.createCell('團員都有自帶環保杯')
  ].map(cellData => new TheThingCell().fromJSON(cellData))
);

export const TourPlanWithPlaysNoEquipment = MinimalTourPlan.clone();
TourPlanWithPlaysNoEquipment.setState(
  ImitationTourPlan.stateName,
  ImitationTourPlan.states.new
);
for (const play of PlaysWithoutEquipment) {
  const purchase = Purchase.purchase(
    TourPlanWithPlaysNoEquipment,
    play,
    random(10, 50)
  );
  TourPlanWithPlaysNoEquipment.addRelation(purchase.toRelation());
}
TourPlanWithPlaysNoEquipment.name = `測試遊程(預訂體驗, 無設備加購)_${Date.now()}`;

export const TourPlanWithPlaysAndEquipments = MinimalTourPlan.clone();
TourPlanWithPlaysAndEquipments.setState(
  ImitationTourPlan.stateName,
  ImitationTourPlan.states.new
);
for (const play of PlaysWithEquipment) {
  const purchase = Purchase.purchase(
    TourPlanWithPlaysAndEquipments,
    play,
    random(10, 50)
  );
  TourPlanWithPlaysAndEquipments.addRelation(purchase.toRelation());
  if (play.hasRelation(RelationshipEquipment.name)) {
    for (const relation of play.getRelations(RelationshipEquipment.name)) {
      const addition = find(
        SampleEquipments,
        ad => ad.id === relation.objectId
      );
      if (addition) {
        const purchaseAd = Purchase.purchase(
          TourPlanWithPlaysAndEquipments,
          addition,
          random(1, 10)
        );
        TourPlanWithPlaysAndEquipments.addRelation(purchaseAd.toRelation());
      }
    }
  }
}
TourPlanWithPlaysAndEquipments.name = `測試遊程(預訂體驗, 有加購項目)_${Date.now()}`;

export const TourPlanInApplication = TourPlanWithPlaysAndEquipments.clone();
TourPlanInApplication.name = `測試遊程(預訂體驗, 有加購項目，已提交申請)_${Date.now()}`;
TourPlanInApplication.setState(
  ImitationOrder.stateName,
  ImitationTourPlan.states.applied
);

export const TourPlanPaid = TourPlanInApplication.clone();
TourPlanPaid.name = `測試遊程(預訂體驗, 有加購項目，已付款完成)_${Date.now()}`;
TourPlanPaid.setState(ImitationOrder.stateName, ImitationTourPlan.states.paid);

export const TourPlanCompleted = TourPlanPaid.clone();
TourPlanCompleted.name = `測試遊程(預訂體驗, 有加購項目，已全部完成)_${Date.now()}`;
TourPlanCompleted.setState(
  ImitationOrder.stateName,
  ImitationTourPlan.states.completed
);

export function stubTourPlansByStateAndMonth(): {
  [state: string]: TheThing[];
} {
  const result = {};
  for (const name in pick(
    ImitationTourPlan.states,
    ImitationTourPlan.admin.states
  )) {
    if (ImitationTourPlan.states.hasOwnProperty(name)) {
      const state = ImitationTourPlan.states[name];

      const tourPlanThisMonth = TourPlanWithPlaysAndEquipments.clone();
      tourPlanThisMonth.name = `測試遊程， ${state.label}(這個月)_${Date.now()}`;
      tourPlanThisMonth.setState(
        ImitationOrder.stateName,
        state,
        moment().toDate()
      );

      const tourPlanLastMonth = TourPlanWithPlaysAndEquipments.clone();
      tourPlanLastMonth.name = `測試遊程， ${state.label}(上個月)_${Date.now()}`;
      tourPlanLastMonth.setState(
        ImitationOrder.stateName,
        state,
        moment()
          .subtract(1, 'month')
          .toDate()
      );

      const tourPlanTheOtherMonth = TourPlanWithPlaysAndEquipments.clone();
      tourPlanTheOtherMonth.name = `測試遊程， ${state.label}(上上個月)_${Date.now()}`;
      tourPlanTheOtherMonth.setState(
        ImitationOrder.stateName,
        state,
        moment()
          .subtract(2, 'month')
          .toDate()
      );

      result[state.name] = [
        tourPlanThisMonth,
        tourPlanLastMonth,
        tourPlanTheOtherMonth
      ];
    }
  }
  return result;
}
