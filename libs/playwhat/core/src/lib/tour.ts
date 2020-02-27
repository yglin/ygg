import { TheThingImitation, TheThing } from '@ygg/the-thing/core';

export const RelationNamePlay = '體驗';

export const TemplateTour: TheThing = new TheThing().fromJSON({
  id: 'nZCfXLG3Z06TYcchlpfMxw',
  tags: ['tour', '體驗組合'],
  name: '體驗從早玩到晚',
  view: 'tour',
  cells: [
    {
      name: '注意事項',
      type: 'html',
      value: ''
    },
    {
      name: '聯絡資訊',
      type: 'html',
      value: ''
    },
    {
      name: '照片',
      type: 'album',
      value: {
        cover: '/assets/images/background.png',
        photos: ['/assets/images/background.png']
      }
    }
  ]
});

export const ImitationTour: TheThingImitation = new TheThingImitation().fromJSON(
  {
    id: 'BENBuYSEiEm-r97WjCGutQ',
    name: '體驗組合',
    description: '選擇體驗組合成一個套裝行程',
    image: '/assets/images/tour/tour.svg',
    templateId: TemplateTour.id,
    cellsDef: {
      注意事項: 'number',
      聯絡資訊: 'contact'
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
