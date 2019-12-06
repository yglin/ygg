import { PageObject } from "@ygg/shared/test/page-object";
import { FormControlModel } from '../form-control';

export class DynamicFormPageObject extends PageObject {
  selectors = {
    main: '.dynamic-form',
    buttonSubmit: 'button.submit'
  }

  getSelectorForControl(controlModel: FormControlModel): string {
    return `${this.getSelector()} [control-name="${controlModel.name}"]`;
  }
}