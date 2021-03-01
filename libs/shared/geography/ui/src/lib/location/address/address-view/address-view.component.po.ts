// import { ViewPageObject } from '@ygg/shared/infra/test-utils';
import { Address } from '@ygg/shared/geography/core';
import { PageObject } from "@ygg/shared/test/page-object";

// export class AddressViewComponentPageObject extends ViewPageObject<Address> {
//   selector = '.address-view'
//   selectors = {
//     fullAddress: '.full-address'
//   };

//   expectValue(address: Address) {
//     this.tester.expectTextContent(this.getSelector('fullAddress'), address.getFullAddress());
//   }
// }

export abstract class AddressViewPageObject extends PageObject {
  selectors = {
    main: '.address-view',
    fullAddress: '.full-address'
  }

  abstract expectValue(value: Address): void;
}