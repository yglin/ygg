import { PageObject } from '@ygg/shared/test/page-object';
import { BusinessHours } from '@ygg/shared/omni-types/core';

export abstract class BusinessHoursViewPageObject extends PageObject {
  selectors = {
    main: '.business-hours-view'
  };

  abstract expectValue(businessHours: BusinessHours);
}
