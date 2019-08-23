import { ViewPageObject } from '@ygg/shared/infra/test-utils';
import { Address } from '../address';

export class AddressViewComponentPageObject extends ViewPageObject<Address> {
  selector = '.address-view'
  selectors = {
    fullAddress: '.full-address'
  };

  expectValue(address: Address) {
    this.tester.expectTextContent(this.getSelector('fullAddress'), address.getFullAddress());
  }
}
