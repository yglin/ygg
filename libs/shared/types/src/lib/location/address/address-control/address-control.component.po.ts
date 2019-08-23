import { ControlPageObject } from '@ygg/shared/infra/test-utils';
import { Address } from '../address';

export class AddressControlComponentPageObject extends ControlPageObject<Address> {
  selector = '.address-control'
  selectors = {
    rawInput: 'input#raw'
  };

  getLabel(): string {
    return this.tester.getAttribute(this.getSelector('rawInput'), 'placeholder');
  }

  setValue(value: Address) {
    this.tester.inputText(this.getSelector('rawInput'), value.getFullAddress());
  }
}

