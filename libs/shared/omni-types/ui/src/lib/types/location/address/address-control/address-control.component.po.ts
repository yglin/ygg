// import { ControlPageObject } from '@ygg/shared/infra/test-utils';
import { Address } from '@ygg/shared/omni-types/core';
import { PageObject } from "@ygg/shared/test/page-object";

// export class AddressControlComponentPageObject extends ControlPageObject<Address> {
//   selector = '.address-control'
//   selectors = {
//     rawInput: 'input#raw'
//   };

//   getLabel(): string {
//     return this.tester.getAttribute(this.getSelector('rawInput'), 'placeholder');
//   }

//   setValue(value: Address) {
//     this.tester.inputText(this.getSelector('rawInput'), value.getFullAddress());
//   }
// }

export abstract class AddressControlPageObject extends PageObject {
  selectors = {
    main: '.address-control',
    rawInput: 'input.raw'
  }

  abstract setValue(value: Address): void;
}
