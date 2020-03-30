import { TheThingImitation, TheThing, RelationDef } from '@ygg/the-thing/core';
import { RelationAddition } from '@ygg/shopping/core';

export const ImitationPlay: TheThingImitation = new TheThingImitation().fromJSON(
  {
    id: 'dSoAfEnTUUCAeAMJT3Ob2w',
    name: '體驗範本',
    description: '體驗項目，包含簡介、照片、費用、體驗時長和人數限制...等',
    icon: 'local_play',
    image: '/assets/images/play/play.svg',
    view: 'play',
    tags: ['play', '體驗'],
    cellsDef: {
      副標題: {
        name: '副標題',
        type: 'text',
        userInput: 'optional'
      },
      簡介: {
        name: '簡介',
        type: 'html',
        userInput: 'required'
      },
      照片: {
        name: '照片',
        type: 'album',
        userInput: 'required'
      },
      費用: {
        name: '費用',
        type: 'number',
        userInput: 'required'
      },
      時長: {
        name: '時長',
        type: 'number',
        userInput: 'required'
      },
      人數下限: {
        name: '人數下限',
        type: 'number',
        userInput: 'required'
      },
      人數上限: {
        name: '人數上限',
        type: 'number',
        userInput: 'required'
      },
      地點: {
        name: '地點',
        type: 'location',
        userInput: 'optional'
      },
      服務時段: {
        name: '服務時段',
        type: 'business-hours',
        userInput: 'optional'
      }
    },
    cellsOrder: [
      '照片',
      '簡介',
      '費用',
      '時長',
      '人數下限',
      '人數上限',
      '副標題',
      '地點',
      '服務時段'
    ],
    dataTableConfig: {
      columns: {
        簡介: {
          label: '簡介'
        },
        費用: {
          label: '每人費用'
        },
        時長: {
          label: '體驗時長(分鐘)'
        }
      }
    },
    filter: {
      name: '搜尋體驗項目',
      tags: ['play', '體驗']
    }
  }
);

ImitationPlay.addRelationDef(RelationAddition);
