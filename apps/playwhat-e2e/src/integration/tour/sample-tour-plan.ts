import {
  TheThing,
  TheThingCell,
  TheThingRelation,
  TheThingCellTypes
} from '@ygg/the-thing/core';
import { DateRange, DayTimeRange, Contact } from '@ygg/shared/omni-types/core';
import { randomBytes } from 'crypto';
import { random, find } from 'lodash';
import {
  SamplePlays,
  SampleAdditions,
  PlaysWithoutAddition,
  PlaysWithAddition
} from '../play/sample-plays';
import {
  RelationNamePurchase,
  CellNameQuantity,
  RelationAddition,
  Purchase
} from '@ygg/shopping/core';
import { ApplicationState } from '@ygg/playwhat/core';

export const TourPlanTemplate = new TheThing().fromJSON({
  tags: ['tour', 'tour-plan', 'schedule', '遊程計畫'],
  name: '遊程計畫名稱',
  imitation: 'tour-plan',
  view: 'tour-plan',
  cells: [
    {
      name: '預計出遊日期',
      type: 'date-range',
      value: DateRange.forge().toJSON()
    },
    {
      name: '預計遊玩時間',
      type: 'day-time-range',
      value: DayTimeRange.forge().toJSON()
    },
    {
      name: '預計參加人數',
      type: 'number',
      value: 100
    }
  ]
});

const dateRange = DateRange.forge();
export const MinimalTourPlan = new TheThing().fromJSON({
  tags: ['tour-plan', '遊程規劃'],
  name: `測試遊程(最少需求資料)`,
  view: 'tour-plan',
  cells: [
    {
      name: '預計出遊日期',
      type: 'date-range',
      value: dateRange.toJSON()
    },
    {
      name: '預計參加人數',
      type: 'number',
      value: random(3, 100)
    },
    {
      name: '聯絡資訊',
      type: 'contact',
      value: Contact.forge()
    }
  ]
});

export const MinimalTourPlanWithoutName = MinimalTourPlan.clone();
delete MinimalTourPlanWithoutName.name;

export const TourPlanFull = MinimalTourPlan.clone();
TourPlanFull.name = '測試遊程(完整資料欄位)';
TourPlanFull.addCells(
  [
    {
      name: '預計遊玩時間',
      type: 'day-time-range',
      value: DayTimeRange.forge().toJSON()
    },
    {
      name: '用餐需求',
      type: 'longtext',
      value: '本團吃全素'
    },
    {
      name: '交通需求',
      type: 'longtext',
      value: '請幫忙代租一台十人的小巴士'
    },
    {
      name: '長輩人數',
      type: 'number',
      value: 7
    },
    {
      name: '孩童人數',
      type: 'number',
      value: 5
    },
    {
      name: '司領人數',
      type: 'number',
      value: 2
    },
    {
      name: '其他注意事項',
      type: 'longtext',
      value: '團員都有自帶環保杯'
    }
  ].map(cellData => new TheThingCell().fromJSON(cellData))
);

export const TourPlanFullWithPlays = TourPlanFull.clone();
TourPlanFullWithPlays.name = '測試遊程(完整資料欄位＋預訂體驗)';
for (const play of SamplePlays) {
  const purchase = Purchase.purchase(
    TourPlanFullWithPlays,
    play,
    random(10, 50)
  );
  TourPlanFullWithPlays.addRelation(purchase.toRelation());
}

export const TourPlanWithPlaysNoAddition = MinimalTourPlan.clone();
for (const play of PlaysWithoutAddition) {
  const purchase = Purchase.purchase(
    TourPlanWithPlaysNoAddition,
    play,
    random(10, 50)
  );
  TourPlanWithPlaysNoAddition.addRelation(purchase.toRelation());
}
TourPlanWithPlaysNoAddition.name = '測試遊程(預訂體驗, 無加購項目)';

export const TourPlanWithPlaysAndAdditions = MinimalTourPlan.clone();
for (const play of PlaysWithAddition) {
  const purchase = Purchase.purchase(
    TourPlanWithPlaysAndAdditions,
    play,
    random(10, 50)
  );
  TourPlanWithPlaysAndAdditions.addRelation(purchase.toRelation());
  if (play.hasRelation(RelationAddition.name)) {
    for (const relation of play.getRelations(RelationAddition.name)) {
      const addition = find(SampleAdditions, ad => ad.id === relation.objectId);
      if (addition) {
        const purchaseAd = Purchase.purchase(
          TourPlanWithPlaysAndAdditions,
          addition,
          random(1, 10)
        );
        TourPlanWithPlaysAndAdditions.addRelation(purchaseAd.toRelation());
      }
    }
  }
}
TourPlanWithPlaysAndAdditions.name = '測試遊程(預訂體驗, 有加購項目)';

export const TourPlanInApplication = TourPlanWithPlaysAndAdditions.clone();
TourPlanInApplication.name = '測試遊程(預訂體驗, 有加購項目，已提交申請)';
TourPlanInApplication.setFlag(ApplicationState.InApplication, true);
