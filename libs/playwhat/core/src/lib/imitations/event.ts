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

export const RelationshipPlay: Relationship = new Relationship({
  name: '體驗項目',
  imitation: ImitationPlay
});
