import {
  TheThingImitation,
  TheThing,
  RelationDefine,
  TheThingCellDefine,
  TheThingCell
} from '@ygg/the-thing/core';
import {
  RelationAddition,
  CellNames as CellNamesShopping
} from '@ygg/shopping/core';
import { __values } from 'tslib';
import { values } from 'lodash';

export const ImitationPlayCellDefines: { [key: string]: TheThingCellDefine } = {
  album: new TheThingCellDefine({
    name: '照片',
    type: 'album',
    userInput: 'required'
  }),
  introduction: new TheThingCellDefine({
    name: '簡介',
    type: 'html',
    userInput: 'required'
  }),
  price: new TheThingCellDefine({
    name: CellNamesShopping.price,
    type: 'number',
    userInput: 'required'
  }),
  timeLength: new TheThingCellDefine({
    name: '時長',
    type: 'number',
    userInput: 'required'
  }),
  minParticipants: new TheThingCellDefine({
    name: '人數下限',
    type: 'number',
    userInput: 'required'
  }),
  maxParticipants: new TheThingCellDefine({
    name: '人數上限',
    type: 'number',
    userInput: 'required'
  }),
  subtitle: new TheThingCellDefine({
    name: '副標題',
    type: 'text',
    userInput: 'optional'
  }),
  location: new TheThingCellDefine({
    name: '地點',
    type: 'location',
    userInput: 'optional'
  }),
  businessHours: new TheThingCellDefine({
    name: '服務時段',
    type: 'business-hours',
    userInput: 'optional'
  })
};

export const ImitationPlay: TheThingImitation = new TheThingImitation().fromJSON(
  {
    id: 'dSoAfEnTUUCAeAMJT3Ob2w',
    name: '體驗範本',
    description: '體驗項目，包含簡介、照片、費用、體驗時長和人數限制...等',
    icon: 'local_play',
    image: '/assets/images/play/play.svg',
    view: 'play',
    routePath: 'plays',
    tags: ['play', '體驗'],
    cellsOrder: [
      ImitationPlayCellDefines.album.name,
      ImitationPlayCellDefines.introduction.name,
      ImitationPlayCellDefines.price.name,
      ImitationPlayCellDefines.timeLength.name,
      ImitationPlayCellDefines.minParticipants.name,
      ImitationPlayCellDefines.maxParticipants.name,
      ImitationPlayCellDefines.subtitle.name,
      ImitationPlayCellDefines.location.name,
      ImitationPlayCellDefines.businessHours.name
    ],
    cellsDef: values(ImitationPlayCellDefines),
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
      name: '搜尋體驗',
      tags: ['play', '體驗']
    }
  }
);

ImitationPlay.addRelationDefine(RelationAddition);
