import { TheThingImitation, TheThing } from '@ygg/the-thing/core';
import { DateRange } from '@ygg/shared/omni-types/core';

export const TemplateTourPlan: TheThing = new TheThing().fromJSON({
  id: 'ep7Ds0lz9UKkII3NgyVrsA',
  tags: ['tour-plan', '遊程規劃'],
  name: '某某寶地一日遊',
  view: 'tour-plan',
  cells: [
    {
      name: '預計出遊日期',
      type: 'date-range',
      value: null
    },
    {
      name: '預計參加人數',
      type: 'number',
      value: 0
    },
    {
      name: '聯絡資訊',
      type: 'contact',
      value: null
    }
  ]
});

export const ImitationTourPlan: TheThingImitation = new TheThingImitation().fromJSON(
  {
    id: 'BvyVkzRIxEuYoPjxIjHVOA',
    name: '旅遊行程規劃',
    description: '規劃你想玩的體驗組合，預計出遊日期、參加人數，以及其他細節',
    image: '/assets/images/tour/tour-plans.svg',
    templateId: TemplateTourPlan.id,
    cellsDef: {
      '預計出遊日期': 'date-range',
      '預計參加人數': 'number',
      '聯絡資訊': 'contact'
    },
    dataTableConfig: {
      columns: {
        '預計出遊日期': {
          label: '預計出遊日期'
        },
        '預計參加人數': {
          label: '預計參加人數'
        },
        '聯絡資訊': {
          label: '聯絡資訊'
        },
      }
    },
    filter: {
      name: '搜尋旅遊行程',
      tags: ['tour-plan', '遊程規劃']
    }
  }
);
