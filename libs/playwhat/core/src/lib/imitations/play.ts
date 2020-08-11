import {
  PurchaseAction,
  ShoppingCellDefines
} from '@ygg/shopping/core';
import {
  Relationship,
  TheThing,
  TheThingCellDefine,
  TheThingImitation
} from '@ygg/the-thing/core';
import { extend, values } from 'lodash';
import { ImitationEquipment } from './equipment';
import { CellDefines, CellIds } from './cell-defines';

export const ImitationPlayCellDefines: { [key in CellIds]?: TheThingCellDefine } = {
  album: CellDefines.album.extend({
    userInput: 'required'
  }),
  introduction: CellDefines.introduction.extend({
    userInput: 'required'
  }),
  price: ShoppingCellDefines.price.extend({
    label: '單價（每人）',
    userInput: 'required'
  }),
  timeLength: CellDefines.timeLength.extend({
    label: '體驗時長',
    userInput: 'required'
  }),
  minimum: ShoppingCellDefines.minimum.extend({
    label: '報名人數下限',
    userInput: 'required'
  }),
  maximum: ShoppingCellDefines.maximum.extend({
    label: '報名人數上限',
    userInput: 'required'
  }),
  subtitle: CellDefines.subtitle.extend({
    userInput: 'optional'
  }),
  location: CellDefines.location.extend({
    userInput: 'required'
  }),
  businessHours: CellDefines.businessHours.extend({
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
    routePath: 'play',
    tags: ['play', '體驗'],
    cellsOrder: [
      ImitationPlayCellDefines.album.id,
      ImitationPlayCellDefines.introduction.id,
      ImitationPlayCellDefines.price.id,
      ImitationPlayCellDefines.timeLength.id,
      ImitationPlayCellDefines.minimum.id,
      ImitationPlayCellDefines.maximum.id,
      ImitationPlayCellDefines.subtitle.id,
      ImitationPlayCellDefines.location.id,
      ImitationPlayCellDefines.businessHours.id
    ],
    cellsDef: values(ImitationPlayCellDefines),
    filter: {
      name: '搜尋體驗',
      tags: ['play', '體驗']
    }
  }
);

const dataTableColumns = {};
dataTableColumns[ImitationPlayCellDefines.introduction.id] = {
  name: ImitationPlayCellDefines.introduction.id,
  label: '簡介',
  valueSource: 'cell'
};
dataTableColumns[ImitationPlayCellDefines.price.id] = {
  name: ImitationPlayCellDefines.price.id,
  label: '費用(每人)',
  valueSource: 'cell'
};
dataTableColumns[ImitationPlayCellDefines.timeLength.id] = {
  name: ImitationPlayCellDefines.timeLength.id,
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

ImitationPlay.stateChanges = {
  initial: {
    next: ImitationPlay.states.new
  },
  onSave: {
    previous: ImitationPlay.states.new,
    next: ImitationPlay.states.editing
  }
};

// ImitationPlay.addRelationDefine(RelationAddition);
