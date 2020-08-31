import { OmniTypes } from '@ygg/shared/omni-types/core';
import {
  TheThingCellDefine,
  TheThingImitation,
  TheThingState,
  TheThing,
  CommonCellDefines,
  Relationship
} from '@ygg/the-thing/core';
import { values, keyBy } from 'lodash';
import { User } from '@ygg/shared/user/core';
import { ImitationItemTransfer } from './item-transfer';

export const ImitationItemCells = keyBy(
  [
    CommonCellDefines.album.extend({
      userInput: 'required'
    }),
    CommonCellDefines.location.extend({
      label: '物品所在地',
      userInput: 'required'
    })
  ],
  'id'
);

export const ImitationItemStates: { [name: string]: TheThingState } = {
  new: {
    name: 'new',
    label: '新建立',
    value: 10
  },
  editing: {
    name: 'editing',
    label: '修改中',
    value: 30
  },
  available: {
    name: 'available',
    label: '開放索取',
    value: 100
  },
  transfer: {
    name: 'transfer',
    label: '正在讓渡',
    value: 110
  }
};

export const ImitationItem = new TheThingImitation({
  collection: 'ourbox-items',
  id: 'ourbox-item',
  icon: 'category',
  name: '我們的寶物',
  image: '/assets/images/item/item.png',
  routePath: 'ouritems',
  cellsDef: values(ImitationItemCells),
  stateName: 'ourbox-item-state',
  states: ImitationItemStates,
  canModify: (theThing: TheThing): boolean => {
    return (
      ImitationItem.isState(theThing, ImitationItem.states.new) ||
      ImitationItem.isState(theThing, ImitationItem.states.editing)
    );
  },
  stateChanges: {
    initial: {
      next: ImitationItemStates.new
    },
    onSave: {
      previous: ImitationItemStates.new,
      next: ImitationItemStates.editing
    }
  }
});

export const RelationshipItemHolder = new Relationship({
  name: 'ourbox-item-holder',
  subjectImitation: ImitationItem,
  objectCollection: User.collection
});

export const RelationshipItemRequester = new Relationship({
  name: 'ourbox-request-borrow-item',
  subjectImitation: ImitationItem,
  objectCollection: User.collection
});

ImitationItem.actions = {
  'publish-available': {
    id: 'ourbox-item-publish-available',
    icon: 'card_giftcard',
    tooltip: '開放寶物讓人索取',
    permissions: [`state: ${ImitationItemStates.editing.name}`, 'requireOwner']
  },
  request: {
    id: 'ourbox-item-request',
    icon: 'loyalty',
    tooltip: '我要借這個',
    permissions: [
      `state: ${ImitationItemStates.available.name}`,
      `role:!${RelationshipItemHolder.name}`,
      `role:!${RelationshipItemRequester.name}`
    ]
  },
  'cancel-request': {
    id: 'ourbox-cancel-request',
    icon: 'backspace',
    tooltip: '取消索取需求',
    permissions: [
      `state:${ImitationItemStates.available.name}`,
      `role:!${RelationshipItemHolder.name}`,
      `role:${RelationshipItemRequester.name}`
    ]
  },
  'transfer-next': {
    id: 'ourbox-transfer-to-next',
    icon: 'next_plan',
    tooltip: '交付給下一位索取者',
    permissions: [
      `state:${ImitationItemStates.available.name}`,
      `role:${RelationshipItemHolder.name}`,
      `relations:has:${RelationshipItemRequester.name}`
    ]
  },
  'check-item-transfer': {
    id: 'ourbox-check-item-transfer',
    icon: 'connect_without_contact',
    tooltip: '檢視交付任務',
    permissions: [
      `state:${ImitationItemStates.transfer.name}`,
      `role:${RelationshipItemHolder.name},${RelationshipItemRequester.name}`
    ]
  }
};

// export class Item extends TheThing {
//   static forge() {
//     const item = TheThing.forge();
//     item.upsertCell(
//       new TheThingCell({
//         name: CellIds.location,
//         type: OmniTypes.location.id,
//         value: Location.forge()
//       })
//     );
//     return item;
//   }
// }
