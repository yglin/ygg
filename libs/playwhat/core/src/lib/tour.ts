import { TheThingImitation, TheThing } from '@ygg/the-thing/core';

export const RelationNamePlay = '體驗';

export const ImitationTour: TheThingImitation = new TheThingImitation().fromJSON(
  {
    id: 'BENBuYSEiEm-r97WjCGutQ',
    name: '體驗組合',
    description: '選擇體驗組合成一個套裝行程',
    image: '/assets/images/tour/tour.svg',
    // templateId: TemplateTour.id,
    cellsDef: {
      注意事項: {
        name: '注意事項',
        type: 'html',
        userInput: 'optional'
      },
      聯絡資訊: {
        name: '聯絡資訊',
        type: 'html',
        userInput: 'required'
      }      
    },
    dataTableConfig: {
      columns: {
        聯絡資訊: {
          label: '聯絡資訊'
        },
        注意事項: {
          label: '注意事項'
        }
      }
    },
    filter: {
      name: '搜尋體驗組合',
      tags: ['tour', '體驗組合']
    }
  }
);
