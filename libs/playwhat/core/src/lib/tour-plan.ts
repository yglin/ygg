import {
  TheThingImitation,
  TheThing,
  Relationship,
  TheThingCellDefine
} from '@ygg/the-thing/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { ImitationOrder } from '@ygg/shopping/core';
import { keyBy, values, mapValues } from 'lodash';
import { ImitationEvent } from './imitations';

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

export const CellDefinesTourPlan = mapValues(
  {
    dateRange: {
      name: '預計出遊日期',
      type: 'date-range',
      userInput: 'required'
    },
    numParticipants: {
      name: '預計參加人數',
      type: 'number',
      userInput: 'required'
    },
    contact: {
      name: '聯絡資訊',
      type: 'contact',
      userInput: 'required'
    },
    dayTimeRange: {
      name: '預計遊玩時間',
      type: 'day-time-range',
      userInput: 'optional'
    },
    aboutMeals: {
      name: '用餐需求',
      type: 'longtext',
      userInput: 'optional'
    },
    aboutTransport: {
      name: '交通需求',
      type: 'longtext',
      userInput: 'optional'
    },
    numElders: {
      name: '長輩人數',
      type: 'number',
      userInput: 'optional'
    },
    numKids: {
      name: '孩童人數',
      type: 'number',
      userInput: 'optional'
    },
    numPartTimes: {
      name: '司領人數',
      type: 'number',
      userInput: 'optional'
    },
    misc: {
      name: CellNames.misc,
      type: 'html',
      userInput: 'optional'
    }
  },
  (data: any) => new TheThingCellDefine(data)
);

const cellsOrder = [
  CellDefinesTourPlan.dateRange.name,
  CellDefinesTourPlan.numParticipants.name,
  CellDefinesTourPlan.contact.name,
  CellDefinesTourPlan.dayTimeRange.name,
  CellDefinesTourPlan.aboutMeals.name,
  CellDefinesTourPlan.aboutTransport.name,
  CellDefinesTourPlan.numElders.name,
  CellDefinesTourPlan.numKids.name,
  CellDefinesTourPlan.numPartTimes.name,
  CellDefinesTourPlan.misc.name
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

ImitationTourPlan.admin.states = ['applied', 'approved', 'paid', 'completed'];

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
    permissions: ['state:applied', 'requireAdmin'],
    display: {
      position: 'custom'
    }
  },
  'send-approval-requests': {
    id: 'send-approval-requests',
    tooltip: '送出行程確認訊息給各活動負責人',
    icon: 'email',
    permissions: ['state:applied', 'requireAdmin', hasSchedule],
    display: {
      position: 'custom'
    }
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
