import { TimeLength } from '@ygg/shared/omni-types/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { NumberControlPageObjectCypress } from '../../number';

export class TimeLengthControlPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.time-length-control',
    numberControl: '.number-control'
  };

  numberControlPO: NumberControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.numberControlPO = new NumberControlPageObjectCypress(
      this.getSelector('numberControl')
    );
  }

  setValue(value: TimeLength) {
    this.numberControlPO.setValue(value.length);
  }
}
