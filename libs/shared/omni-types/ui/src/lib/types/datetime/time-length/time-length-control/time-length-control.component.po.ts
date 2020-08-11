import { ControlPageObject } from '@ygg/shared/test/page-object';
import { NumberControlPageObject } from '../../../number';
import { TimeLength } from '@ygg/shared/omni-types/core';

export abstract class TimeLengthControlPageObject extends ControlPageObject {
  selectors = {
    main: '.time-length-control',
    numberControl: '.number-control'
  };

  numberControlPO: NumberControlPageObject;

  setValue(value: TimeLength) {
    this.numberControlPO.setValue(value.length);
  }
}
