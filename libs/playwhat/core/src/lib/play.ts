import { TheThingImitation, TheThing, RelationDef } from '@ygg/the-thing/core';
import { RelationAddition } from '@ygg/shopping/core';

export const ImitationPlay: TheThingImitation = new TheThingImitation().fromJSON(
  {
    id: 'dSoAfEnTUUCAeAMJT3Ob2w',
    name: '體驗範本',
    description: '體驗項目，包含簡介、照片、費用、體驗時長和人數限制...等',
    image: '/assets/images/play/play.svg',
    view: 'play',
    tags: ['play', '體驗'],
    cellsDef: {
      副標題: {
        name: '副標題',
        type: 'text'
      },
      簡介: {
        name: '簡介',
        type: 'longtext',
        required: true
      },
      照片: {
        name: '照片',
        type: 'album',
        required: true
      },
      費用: {
        name: '費用',
        type: 'number',
        required: true
      },
      時長: {
        name: '時長',
        type: 'number',
        required: true
      },
      人數下限: {
        name: '人數下限',
        type: 'number',
        required: true
      },
      人數上限: {
        name: '人數上限',
        type: 'number',
        required: true
      }
    },
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
