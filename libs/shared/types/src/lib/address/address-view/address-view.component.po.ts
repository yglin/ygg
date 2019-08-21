import { PageObject } from '@ygg/shared/infra/test-utils';

export class AddressViewComponentPageObject extends PageObject {
  selector = '.address-view'
  selectors = {
    fullAddress: '.full-address'
  };
}
