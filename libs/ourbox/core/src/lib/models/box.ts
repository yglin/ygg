import { TheThingImitation, TheThingCellDefine } from '@ygg/the-thing/core';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { values } from 'lodash';

export const ImitationBoxCells = {
  public: new TheThingCellDefine({
    name: '公開',
    type: OmniTypes.boolean.id,
    userInput: 'required'
  })
};

export const ImitationBox = new TheThingImitation({
  collection: 'ourboxes',
  cellsDef: values(ImitationBoxCells)
});
