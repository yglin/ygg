import {
  TheThingImitation,
  TheThingCellDefine,
  TheThingState,
  TheThing,
  TheThingAction
} from '@ygg/the-thing/core';
import { values } from 'lodash';
import { OmniTypes } from '@ygg/shared/omni-types/core';

export const RelationshipItemTransferItem = {
  role: 'subject-item'
};

export const RelationshipItemTransferGiver = {
  role: 'giver'
};

export const RelationshipItemTransferReceiver = {
  role: 'receiver'
};

export const ImitationItemTransferCellDefines: {
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

export const ImitationItemTransferStates: { [name: string]: TheThingState } = {
  new: {
    name: 'new',
    label: '新建立',
    value: 10
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
  'item-transfer-consent-reception': {
    id: 'item-transfer-consent-reception',
    icon: 'event_available',
    tooltip: '確定會依約收取寶物',
    permissions: [
      `state:${ImitationItemTransferStates.new.name}`,
      `role:${RelationshipItemTransferReceiver.role}`
    ]
  },
  'item-transfer-confirm-completed': {
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
    ImitationItemTransferCellDefines.datetime.name,
    ImitationItemTransferCellDefines.location.name
  ],
  canModify: (theThing: TheThing): boolean => {
    return ImitationItemTransfer.isState(
      theThing,
      ImitationItemTransfer.states.new
    );
  },
  preSave: (theThing: TheThing): TheThing => {
    ImitationItemTransfer.setState(
      theThing,
      ImitationItemTransfer.states.editing
    );
    return theThing;
  },
  actions: ImitationItemTransferActions
});
