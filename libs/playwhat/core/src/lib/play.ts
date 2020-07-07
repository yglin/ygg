import {
  TheThingImitation,
  TheThing,
  RelationDefine,
  TheThingCellDefine,
  TheThingCell,
  Relationship
} from '@ygg/the-thing/core';
import {
  RelationAddition,
  CellNames as CellNamesShopping,
  PurchaseAction
} from '@ygg/shopping/core';
import { __values } from 'tslib';
import { values, extend } from 'lodash';
import { ImitationEquipment } from './equipment';

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
    id: 'play',
    name: '體驗',
    description: '體驗項目，包含簡介、照片、費用、體驗時長和人數限制...等',
    icon: 'local_play',
    image: '/assets/images/play/play.svg',
    view: 'play',
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
    filter: {
      name: '搜尋體驗',
      tags: ['play', '體驗']
    }
  }
);

const dataTableColumns = {};
dataTableColumns[ImitationPlayCellDefines.introduction.name] = {
  name: ImitationPlayCellDefines.introduction.name,
  label: '簡介',
  valueSource: 'cell'
};
dataTableColumns[ImitationPlayCellDefines.price.name] = {
  name: ImitationPlayCellDefines.price.name,
  label: '費用(每人)',
  valueSource: 'cell'
};
dataTableColumns[ImitationPlayCellDefines.timeLength.name] = {
  name: ImitationPlayCellDefines.timeLength.name,
  label: '體驗時長(分鐘)',
  valueSource: 'cell'
};

ImitationPlay.dataTableConfig = { columns: dataTableColumns };

ImitationPlay.stateName = 'playwhat-play-state';
ImitationPlay.states = {
  new: {
    name: 'new',
    label: '新建立',
    value: 10
  },
  editing: {
    name: 'editing',
    label: '修改中',
    value: 15
  },
  assess: {
    name: 'assess',
    label: '審核中',
    value: 20
  },
  forSale: {
    name: 'forSale',
    label: '上架品',
    value: 30
  }
};

export const RelationshipEquipment = new Relationship({
  name: ImitationEquipment.name,
  imitation: ImitationEquipment
});

ImitationPlay.relationships[RelationshipEquipment.name] = RelationshipEquipment;

ImitationPlay.actions = {
  'request-assess': {
    id: 'request-assess',
    icon: 'fact_check',
    tooltip: '送出審核，審核成功即能上架販售',
    permissions: ['requireOwner', 'state:editing']
  },
  'approve-for-sale': {
    id: 'approve-for-sale',
    icon: 'shopping_cart',
    tooltip: '上架體驗，作為商品可公開訂購',
    permissions: ['requireAdmin', 'state:assess']
  },
  'back-to-editing': {
    id: 'back-to-editing',
    icon: 'undo',
    tooltip: '將體驗撤回修改',
    permissions: ['requireAdmin', 'state:assess,forSale']
  }
};

ImitationPlay.actions[PurchaseAction.id] = extend(PurchaseAction, {
  permissions: ['state:forSale']
});

ImitationPlay.canModify = (theThing: TheThing): boolean => {
  return (
    ImitationPlay.isState(theThing, ImitationPlay.states.new) ||
    ImitationPlay.isState(theThing, ImitationPlay.states.editing)
  );
};

ImitationPlay.creators.push(
  (theThing: TheThing): TheThing => {
    ImitationPlay.setState(theThing, ImitationPlay.states.new);
    return theThing;
  }
);

ImitationPlay.preSave = (theThing: TheThing): TheThing => {
  if (ImitationPlay.isState(theThing, ImitationPlay.states.new)) {
    ImitationPlay.setState(theThing, ImitationPlay.states.editing);
  }
  return theThing;
};
// ImitationPlay.addRelationDefine(RelationAddition);
