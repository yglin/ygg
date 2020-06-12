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

export const RelationshipBoxItem = {
  role: 'boxitem'
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
  id: 'ourbox-box',
  name: '我們的寶箱',
  cellsDef: values(ImitationBoxCells),
  routePath: 'ourbox'
});
