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

export const ImitationEventCellDefines = extend(
  mapValues(
    pick(ImitationPlayCellDefines, [
      'location'
      // 'album',
      // 'timeLength',
      // 'introduction'
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
    timeRange: new TheThingCellDefine({
      name: '時段',
      type: OmniTypes['time-range'].id,
      userInput: 'required'
    }),
    numParticipants: new TheThingCellDefine({
      name: '參加人數',
      type: OmniTypes.number.id,
      userInput: 'required'
    })
  }
);

export const ImitationEvent: TheThingImitation = new TheThingImitation({
  id: 'event',
  name: '體驗活動',
  icon: 'event',
  collection: 'events',
  routePath: 'event',
  cellsDef: values(ImitationEventCellDefines),
  cellsOrder: [
    ImitationEventCellDefines.timeRange.name,
    ImitationEventCellDefines.numParticipants.name
    // ImitationEventCellDefines.location.name
  ],
  displays: {
    thumbnail: {
      cells: [
        ImitationEventCellDefines.timeRange.name,
        ImitationEventCellDefines.numParticipants.name
      ]
    }
  }
});

ImitationEvent.dataTableConfig = {
  columns: keyBy(
    [
      {
        name: ImitationEventCellDefines.timeRange.name,
        label: ImitationEventCellDefines.timeRange.name,
        valueSource: 'cell'
      },
      {
        name: ImitationEventCellDefines.numParticipants.name,
        label: ImitationEventCellDefines.numParticipants.name,
        valueSource: 'cell'
      },
      {
        name: '狀態',
        label: '狀態',
        valueSource: 'function',
        valueFunc: (thing: TheThing) => ImitationEvent.getState(thing).label
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

ImitationEvent.canModify = (theThing: TheThing): boolean => {
  return false;
};

export const RelationshipPlay: Relationship = new Relationship({
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
    permissions: ['state:host-approved', 'requireOwner']
  }
};
