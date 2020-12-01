import { OmniTypes } from '@ygg/shared/omni-types/core';
import { TheThingCellDefine, TheThingImitation } from '@ygg/the-thing/core';
import { values } from 'lodash';

export const ImitationRecycleCupCellDefines = {
  capacity: new TheThingCellDefine({
    id: 'capacity',
    label: '容量',
    type: OmniTypes.number.id,
    userInput: 'required'
  })
};

export const ImitationRecycleCup = new TheThingImitation({
  id: 'recycle-cup',
  name: '回收杯杯',
  icon: 'local_drink',
  collection: 'recycle-cups',
  cellsDef: values(ImitationRecycleCupCellDefines)
});
