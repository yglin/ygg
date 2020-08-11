import { TimeLengthControlPageObject } from '@ygg/shared/omni-types/ui';
import { NumberControlPageObjectCypress } from '../../number';

export class TimeLengthControlPageObjectCypress extends TimeLengthControlPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.numberControlPO = new NumberControlPageObjectCypress(
      this.getSelector('numberControl')
    );
  }
}
