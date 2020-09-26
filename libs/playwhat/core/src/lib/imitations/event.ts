import {
  TheThingImitation,
  Relationship,
  TheThingCellDefine,
  TheThingCell,
  TheThing
} from '@ygg/the-thing/core';
import { ImitationPlay, ImitationPlayCellDefines } from './play';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { values, keyBy, extend, pick, mapValues } from 'lodash';
import { User } from '@ygg/shared/user/core';
import { CellDefines } from './cell-defines';

export const ImitationEventCellDefines = extend(
  mapValues(
    pick(ImitationPlayCellDefines, [
      'location',
      'album',
      'timeLength',
      'introduction'
    ]),
    (cellDefine: TheThingCellDefine, key: string) => {
      const cloned = cellDefine.clone();
      if (key === 'location') {
        cloned.userInput = 'required';
      } else {
        cloned.userInput = 'optional';
      }
      return cloned;
    }
  ),
  {
    timeRange: CellDefines.timeRange.extend({
      userInput: 'required'
    }),
    numParticipants: CellDefines.numParticipants.extend({
      userInput: 'required'
    })
  }
);

export const ImitationEvent: TheThingImitation = new TheThingImitation({
  id: 'playwhat-event',
  name: '體驗活動',
  icon: 'event',
  collection: 'events',
  routePath: 'event',
  cellsDef: values(ImitationEventCellDefines),
  cellsOrder: [
    ImitationEventCellDefines.timeRange.id,
    ImitationEventCellDefines.location.id,
    ImitationEventCellDefines.numParticipants.id,
  ],
  displays: {
    thumbnail: {
      cells: [
        ImitationEventCellDefines.timeRange.id,
        ImitationEventCellDefines.numParticipants.id
      ]
    }
  }
});

ImitationEvent.dataTableConfig = {
  columns: keyBy(
    [
      {
        name: ImitationEventCellDefines.timeRange.id,
        label: ImitationEventCellDefines.timeRange.id,
        valueSource: 'cell'
      },
      {
        name: ImitationEventCellDefines.numParticipants.id,
        label: ImitationEventCellDefines.numParticipants.id,
        valueSource: 'cell'
      },
      {
        name: '狀態',
        label: '狀態',
        valueSource: 'function',
        value: (thing: TheThing) => ImitationEvent.getState(thing).label
      }
    ],
    'name'
  )
};

ImitationEvent.stateName = 'playwhat-event';
ImitationEvent.states = {
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
  'wait-approval': {
    name: 'wait-approval',
    label: '等待負責人確認中',
    value: 50
  },
  'host-approved': {
    name: 'host-approved',
    label: '負責人已確認，可成行',
    value: 100
  }
};

ImitationEvent.stateChanges = {
  initial: {
    next: ImitationEvent.states.new
  },
  onSave: {
    previous: ImitationEvent.states.new,
    next: ImitationEvent.states.editing
  }
};

ImitationEvent.canModify = (theThing: TheThing): boolean => {
  return false;
};

export const RelationshipEventService: Relationship = new Relationship({
  name: '體驗項目',
  imitation: ImitationPlay
});

export const RelationshipHost: Relationship = new Relationship({
  name: '活動負責人',
  objectCollection: User.collection
});

export const RelationshipOrganizer: Relationship = new Relationship({
  name: '主辦者',
  objectCollection: User.collection
});

ImitationEvent.actions = {
  'host-approve': {
    id: 'host-approve',
    icon: 'check_circle',
    tooltip: '確認以活動負責人身份參加',
    permissions: ['state:wait-approval', `role:${RelationshipHost.name}`]
  },
  'add-google-calendar': {
    id: 'add-google-calendar',
    icon: '/assets/google/calendar/google-calendar.png',
    tooltip: '將此活動行程加到Google日曆',
    permissions: ['state:host-approved', `role:${RelationshipHost.name}`]
  }
};
