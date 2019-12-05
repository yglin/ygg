import { PageObject } from '@ygg/shared/test/page-object';
import { Accommodation } from '@ygg/resource/core';

export class AccommodationListPageObject extends PageObject {
  selectors = {
    main: '.accommodation-list',
    buttonGotoCreate: 'button.goto-create'
  }

  getSelectorForAccommodation(accommodation: Accommodation): string {
    return `${this.getSelector()} [accommodation-id="${accommodation.id}"]`;
  }
}