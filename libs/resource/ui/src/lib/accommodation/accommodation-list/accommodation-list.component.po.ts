import { PageObject } from '@ygg/shared/test/page-object';
import { Accommodation } from '@ygg/resource/core';

export class AccommodationListPageObject extends PageObject {
  selectors = {
    main: '.accommodation-list',
    buttonGotoCreate: 'button.add-item'
  }

  getSelectorForAccommodation(accommodation: Accommodation): string {
    return `${this.getSelector()} [item-id="${accommodation.id}"]`;
  }
}