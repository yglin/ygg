import { TheThingImitation, TheThing } from '@ygg/the-thing/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { ImitationOrder } from '@ygg/shopping/core';
import { keyBy } from 'lodash';

export const CellNames = {
  dateRange: '預計出遊日期',
  completeAt: '完成時間',
  numParticipants: '預計參加人數',
  contact: '聯絡資訊',
  misc: '其他'
};

export enum States {
  Completed = '已完成'
}

const cellsDef = {
  預計出遊日期: {
    name: '預計出遊日期',
    type: 'date-range',
    userInput: 'required'
  },
  預計參加人數: {
    name: '預計參加人數',
    type: 'number',
    userInput: 'required'
  },
  聯絡資訊: {
    name: '聯絡資訊',
    type: 'contact',
    userInput: 'required'
  },
  預計遊玩時間: {
    name: '預計遊玩時間',
    type: 'day-time-range',
    userInput: 'optional'
  },
  用餐需求: {
    name: '用餐需求',
    type: 'longtext',
    userInput: 'optional'
  },
  交通需求: {
    name: '交通需求',
    type: 'longtext',
    userInput: 'optional'
  },
  長輩人數: {
    name: '長輩人數',
    type: 'number',
    userInput: 'optional'
  },
  孩童人數: {
    name: '孩童人數',
    type: 'number',
    userInput: 'optional'
  },
  司領人數: {
    name: '司領人數',
    type: 'number',
    userInput: 'optional'
  },
  其他: {
    name: CellNames.misc,
    type: 'html',
    userInput: 'optional'
  }
};

const cellsOrder = [
  '預計出遊日期',
  '預計參加人數',
  '聯絡資訊',
  '預計遊玩時間',
  '用餐需求',
  '交通需求',
  '長輩人數',
  '孩童人數',
  '司領人數',
  CellNames.misc
];

export const ImitationTourPlan: TheThingImitation = ImitationOrder.extend({
  id: 'tour-plan',
  name: '旅遊',
  description: '規劃你想玩的體驗組合，預計出遊日期、參加人數，以及其他細節',
  icon: 'directions_bike',
  image: '/assets/images/tour/tour-plans.svg',
  view: 'tour-plan',
  editor: 'tour-plan',
  routePath: 'tour-plans',
  // templateId: TemplateTourPlan.id,
  cellsDef,
  cellsOrder,
  filter: {
    name: '搜尋旅遊行程',
    tags: ['tour-plan', '遊程規劃']
  }
});

ImitationTourPlan.dataTableConfig = {
  columns: keyBy(
    [
      {
        name: '預計出遊日期',
        label: '預計出遊日期',
        valueSource: 'cell'
      },
      {
        name: '預計參加人數',
        label: '預計參加人數',
        valueSource: 'cell'
      },
      {
        name: '聯絡資訊',
        label: '聯絡資訊',
        valueSource: 'cell'
      },
      {
        name: '總價',
        label: '總價',
        valueSource: 'function',
        valueFunc: ImitationOrder.valueFunctions['getTotalCharge']
      }
    ],
    'name'
  )
};

ImitationTourPlan.admin.states = [
  'applied',
  'paid',
  'completed'
]

// export function getTotalCharge(tourPlan: TheThing): number {
//   let totalCharge = 0;
//   const relations = tourPlan.getRelations(RelationPurchase.name);
//   for (const relation of relations) {
//     const charge =
//       relation.getCellValue(CellNames.price) *
//       relation.getCellValue(CellNames.quantity);
//     if (charge) {
//       totalCharge += charge;
//     }
//   }
//   return totalCharge;
// }

ImitationTourPlan.actions = {
  'send-application': {
    id: 'send-application',
    tooltip: '將此遊程計畫送出管理者審核',
    icon: 'send',
    permissions: ['editing', 'requireOwner']
  },
  'cancel-application': {
    id: 'cancel-application',
    tooltip: '取消此遊程計畫的申請',
    icon: 'undo',
    permissions: ['applied', 'requireAdmin']
  },
  'confirm-paid': {
    id: 'confirm-paid',
    tooltip: '標記此遊程的款項已付清',
    icon: 'payment',
    permissions: ['applied', 'requireAdmin']
  },
  'confirm-completed': {
    id: 'confirm-completed',
    tooltip: '標記此遊程的所有活動流程已完成',
    icon: 'done_all',
    permissions: ['paid', 'requireAdmin']
  }
};

ImitationTourPlan.pipes[`cell.${CellNames.dateRange}`] = (
  theThing: TheThing
) => {
  if (!theThing.name) {
    theThing.name = defaultTourPlanName(
      theThing.getCellValue(CellNames.dateRange)
    );
  }
};

export function defaultTourPlanName(dateRange: DateRange): string {
  return `深度遊趣${dateRange.days() + 1}日遊`;
}

ImitationTourPlan.creators.push(
  (theThing: TheThing): TheThing => {
    ImitationTourPlan.setState(theThing, ImitationTourPlan.states.new);
    return theThing;
  }
);

ImitationTourPlan.preSave = (theThing: TheThing): TheThing => {
  if (ImitationTourPlan.isState(theThing, ImitationTourPlan.states.new)) {
    ImitationTourPlan.setState(theThing, ImitationTourPlan.states.editing);
  }
  return theThing;
};

ImitationTourPlan.canModify = (theThing: TheThing): boolean => {
  return (
    ImitationTourPlan.isState(theThing, ImitationTourPlan.states.new) ||
    ImitationTourPlan.isState(theThing, ImitationTourPlan.states.editing)
  );
};

