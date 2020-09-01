import { DateRange } from '@ygg/shared/omni-types/core';
import { ImitationOrder } from '@ygg/shopping/core';
import {
  Relationship,
  TheThing,
  TheThingCellDefine,
  TheThingImitation,
  DataTableColumnConfig
} from '@ygg/the-thing/core';
import { keyBy, mapValues, values, pick, extend } from 'lodash';
import { ImitationEvent } from './event';
import { CellDefines } from './cell-defines';

export const CellDefinesTourPlan = {
  dateRange: CellDefines.dateRange.extend({
    userInput: 'required'
  }),
  numParticipants: CellDefines.numParticipants.extend({
    userInput: 'required'
  }),
  contact: CellDefines.contact.extend({
    userInput: 'required'
  }),
  dayTimeRange: CellDefines.dayTimeRange.extend({
    userInput: 'optional'
  }),
  aboutMeals: CellDefines.aboutMeals.extend({
    userInput: 'optional'
  }),
  aboutTransport: CellDefines.aboutTransport.extend({
    userInput: 'optional'
  }),
  numElders: CellDefines.numElders.extend({
    userInput: 'optional'
  }),
  numKids: CellDefines.numKids.extend({
    userInput: 'optional'
  }),
  numPartTimes: CellDefines.numPartTimes.extend({
    userInput: 'optional'
  }),
  miscNotes: CellDefines.miscNotes.extend({
    userInput: 'optional'
  })
};

export const ImitationTourPlanCellDefines = CellDefinesTourPlan;

const cellsOrder = [
  CellDefinesTourPlan.dateRange.id,
  CellDefinesTourPlan.numParticipants.id,
  CellDefinesTourPlan.contact.id,
  CellDefinesTourPlan.dayTimeRange.id,
  CellDefinesTourPlan.aboutMeals.id,
  CellDefinesTourPlan.aboutTransport.id,
  CellDefinesTourPlan.numElders.id,
  CellDefinesTourPlan.numKids.id,
  CellDefinesTourPlan.numPartTimes.id,
  CellDefinesTourPlan.miscNotes.id
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
  cellsDef: values(CellDefinesTourPlan),
  cellsOrder,
  filter: {
    name: '搜尋旅遊行程',
    tags: ['tour-plan', '遊程規劃']
  }
});

export const RelationshipScheduleEvent: Relationship = new Relationship({
  name: '體驗行程',
  imitation: ImitationEvent
});

ImitationTourPlan.states['waitApproval'] = {
  name: 'waitApproval',
  label: '等待確認',
  value: 38
};

ImitationTourPlan.states['approved'] = {
  name: 'approved',
  label: '可成行',
  value: 40
};

ImitationTourPlan.states['paid'].permissions = ['isAdmin', 'approved'];

ImitationTourPlan.dataTableConfig = {
  columns: extend<{ [key: string]: DataTableColumnConfig }>(
    mapValues(
      pick(CellDefinesTourPlan, [
        CellDefinesTourPlan.dateRange.id,
        CellDefinesTourPlan.numParticipants.id,
        CellDefinesTourPlan.contact.id
      ]),
      cellDefine => {
        return {
          name: cellDefine.id,
          label: cellDefine.label,
          valueSource: 'cell'
        };
      }
    ),
    {
      totalCharge: {
        name: '總價',
        label: '總價',
        valueSource: 'function',
        value: ImitationOrder.valueFunctions['getTotalCharge']
      }
    }
  )
};

ImitationTourPlan.admin.states = [
  'applied',
  'waitApproval',
  'approved',
  'paid',
  'completed'
];

// export function getTotalCharge(tourPlan: TheThing): number {
//   let totalCharge = 0;
//   const relations = tourPlan.getRelations(RelationPurchase.name);
//   for (const relation of relations) {
//     const charge =
//       relation.getCellValue(CellIds.price) *
//       relation.getCellValue(CellIds.quantity);
//     if (charge) {
//       totalCharge += charge;
//     }
//   }
//   return totalCharge;
// }

function hasSchedule(tourPlan: TheThing): boolean {
  return tourPlan.hasRelation(RelationshipScheduleEvent.name);
}

ImitationTourPlan.actions = {
  'send-application': {
    id: 'send-application',
    tooltip: '將此遊程計畫送出管理者審核',
    icon: 'send',
    permissions: ['state:editing', 'requireOwner']
  },
  'cancel-application': {
    id: 'cancel-application',
    tooltip: '取消此遊程計畫的審核申請',
    icon: 'undo',
    permissions: ['state:applied', 'requireAdmin']
  },
  'approve-available': {
    id: 'approve-available',
    tooltip: '標記此遊程計畫可成行',
    icon: 'fact_check',
    permissions: ['state:applied,waitApproval', 'requireAdmin']
  },
  'confirm-paid': {
    id: 'confirm-paid',
    tooltip: '標記此遊程的款項已付清',
    icon: 'payment',
    permissions: ['state:approved', 'requireAdmin']
  },
  'confirm-completed': {
    id: 'confirm-completed',
    tooltip: '標記此遊程的所有活動流程已完成',
    icon: 'done_all',
    permissions: ['state:paid', 'requireAdmin']
  },
  schedule: {
    id: 'schedule',
    tooltip: '為體驗活動編排行程表',
    icon: 'schedule',
    permissions: ['state:applied', 'requireAdmin']
  },
  'send-approval-requests': {
    id: 'send-approval-requests',
    tooltip: '送出行程確認訊息給各活動負責人',
    icon: 'email',
    permissions: ['state:applied', 'requireAdmin', hasSchedule]
  },
  'alter-shopping-cart': {
    id: 'alter-shopping-cart',
    tooltip: '修改預訂項目',
    icon: 'shopping_cart',
    permissions: ['state:new,editing', 'requireOwner']
  }
};

ImitationTourPlan.stateChanges = {
  initial: {
    next: ImitationTourPlan.states.new
  },
  onSave: {
    previous: ImitationTourPlan.states.new,
    next: ImitationTourPlan.states.editing
  }
};

ImitationTourPlan.pipes[`cell.${CellDefinesTourPlan.dateRange.id}`] = (
  theThing: TheThing
) => {
  if (!theThing.name) {
    theThing.name = defaultTourPlanName(
      theThing.getCellValue(CellDefinesTourPlan.dateRange.id)
    );
  }
};

export function defaultTourPlanName(dateRange: DateRange): string {
  return `深度遊趣${dateRange.days() + 1}日遊`;
}

ImitationTourPlan.canModify = (theThing: TheThing): boolean => {
  return (
    ImitationTourPlan.isState(theThing, ImitationTourPlan.states.new) ||
    ImitationTourPlan.isState(theThing, ImitationTourPlan.states.editing)
  );
};
