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
      預計出遊日期: {
        name: '預計出遊日期',
        type: 'date-range',
        required: true
      },
      預計參加人數: {
        name: '預計參加人數',
        type: 'number',
        required: true
      },
      聯絡資訊: {
        name: '聯絡資訊',
        type: 'contact',
        required: true
      },
      預計遊玩時間: {
        name: '預計遊玩時間',
        type: 'day-time-range'
      },
      用餐需求: {
        name: '用餐需求',
        type: 'longtext'
      },
      交通需求: {
        name: '交通需求',
        type: 'longtext'
      },
      長輩人數: {
        name: '長輩人數',
        type: 'number'
      },
      孩童人數: {
        name: '孩童人數',
        type: 'number'
      },
      司領人數: {
        name: '司領人數',
        type: 'number'
      },
      其他注意事項: {
        name: '其他注意事項',
        type: 'longtext'
      }
    },
    dataTableConfig: {
      columns: {
        預計出遊日期: {
          label: '預計出遊日期'
        },
        預計參加人數: {
          label: '預計參加人數'
        },
        聯絡資訊: {
          label: '聯絡資訊'
        }
      }
    },
    filter: {
      name: '搜尋旅遊行程',
      tags: ['tour-plan', '遊程規劃']
    }
  }
);
