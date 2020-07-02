import {
  TheThingImitation,
  Relationship,
  TheThingCellDefine,
  TheThingCell
} from '@ygg/the-thing/core';
import { ImitationPlay } from '../play';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { values } from 'lodash';

export const ImitationEventCellDefines = {
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
};

export const ImitationEvent: TheThingImitation = new TheThingImitation({
  id: 'event',
  collection: 'events',
  routePath: 'event',
  cellsDef: values(ImitationEventCellDefines),
  displays: {
    thumbnail: {
      cells: [
        ImitationEventCellDefines.timeRange.name,
        ImitationEventCellDefines.numParticipants.name
      ]
    }
  }
});

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

export const RelationshipPlay: Relationship = new Relationship({
  name: '體驗項目',
  imitation: ImitationPlay
});
