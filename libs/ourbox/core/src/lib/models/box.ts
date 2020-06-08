import {
  TheThingImitation,
  TheThingCellDefine,
  Relationship
} from '@ygg/the-thing/core';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { values } from 'lodash';

export const RelationshipBoxMember = {
  role: 'member'
};

export const ImitationBoxCells = {
  public: new TheThingCellDefine({
    name: '公開',
    type: OmniTypes.boolean.id,
    userInput: 'required'
  }),
  friends: new TheThingCellDefine({
    name: '箱友',
    type: OmniTypes.text.id,
    userInput: 'hidden'
  })
};

export const ImitationBox = new TheThingImitation({
  collection: 'ourboxes',
  cellsDef: values(ImitationBoxCells),
  routePath: 'ourbox'
});
