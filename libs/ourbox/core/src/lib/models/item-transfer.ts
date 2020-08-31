import {
  TheThingImitation,
  TheThingCellDefine,
  TheThingState,
  TheThing,
  TheThingAction,
  CommonCellDefines
} from '@ygg/the-thing/core';
import { values, keyBy } from 'lodash';

export const RelationshipItemTransferItem = {
  role: 'subject-item'
};

export const RelationshipItemTransferGiver = {
  role: 'giver'
};

export const RelationshipItemTransferReceiver = {
  role: 'receiver'
};

export const ImitationItemTransferCellDefines = keyBy([
  CommonCellDefines.datetime.extend({
    label: '約定時間',
    userInput: 'required',
  }),
  CommonCellDefines.location.extend({
    label: '約定地點',
    userInput: 'required'
  })
], 'id');
/* : {
  [name: string]: TheThingCellDefine;
} = {
  location: new TheThingCellDefine({
    name: '約定地點',
    type: OmniTypes.location.id,
    userInput: 'required'
  }),
  datetime: new TheThingCellDefine({
    name: '約定時間',
    type: OmniTypes.datetime.id,
    userInput: 'required'
  })
};
 */
export const ImitationItemTransferStates: { [name: string]: TheThingState } = {
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
  waitReceiver: {
    name: 'waitReceiver',
    label: '等候收取方同意',
    value: 20
  },
  consented: {
    name: 'consented',
    label: '雙方已同意進行交付',
    value: 30
  },
  completed: {
    name: 'completed',
    label: '已交付完成',
    value: 100
  }
};

export const ImitationItemTransferActions: { [id: string]: TheThingAction } = {
  'send-request': {
    id: 'item-transfer-send-request',
    icon: 'send',
    tooltip: '送出約定通知給收取方',
    permissions: [
      `state:${ImitationItemTransferStates.editing.name}`,
      `role:${RelationshipItemTransferGiver.role}`
    ]
  },
  'consent-reception': {
    id: 'item-transfer-consent-reception',
    icon: 'event_available',
    tooltip: '確定會依約收取寶物',
    permissions: [
      `state:${ImitationItemTransferStates.waitReceiver.name}`,
      `role:${RelationshipItemTransferReceiver.role}`
    ]
  },
  'confirm-completed': {
    id: 'item-transfer-confirm-completed',
    icon: 'done_all',
    tooltip: '確認已收到寶物，交付完成',
    permissions: [
      `state:${ImitationItemTransferStates.consented.name}`,
      `role:${RelationshipItemTransferReceiver.role}`
    ]
  }
};

export const ImitationItemTransfer = new TheThingImitation({
  id: 'ourbox-item-transfer',
  name: 'item-transfer',
  image: '/assets/images/item-transfer/item-transfer.png',
  icon: '6_ft_apart',
  collection: 'ourbox-item-transfers',
  routePath: 'ourbox-item-transfer',
  cellsDef: values(ImitationItemTransferCellDefines),
  stateName: 'ourbox-item-transfer-state',
  states: ImitationItemTransferStates,
  creators: [
    (thing: TheThing): TheThing => {
      thing.setState(
        'ourbox-item-transfer-state',
        ImitationItemTransferStates.new
      );
      return thing;
    }
  ],
  cellsOrder: [
    ImitationItemTransferCellDefines.datetime.id,
    ImitationItemTransferCellDefines.location.id
  ],
  canModify: (theThing: TheThing): boolean => {
    return (
      ImitationItemTransfer.isState(
        theThing,
        ImitationItemTransfer.states.new
      ) ||
      ImitationItemTransfer.isState(
        theThing,
        ImitationItemTransfer.states.editing
      )
    );
  },
  stateChanges: {
    initial: {
      next: ImitationItemTransferStates.new
    },
    onSave: {
      previous: ImitationItemTransferStates.new,
      next: ImitationItemTransferStates.editing
    }
  },
  actions: ImitationItemTransferActions
});
