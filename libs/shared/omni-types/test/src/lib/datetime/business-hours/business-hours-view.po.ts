import { BusinessHoursViewPageObject } from '@ygg/shared/omni-types/ui';
import { BusinessHours, OpenHour } from '@ygg/shared/omni-types/core';
import { OpenHourViewPageObjectCypress } from './open-hour-view.po';

export class BusinessHoursViewPageObjectCypress extends BusinessHoursViewPageObject {
  expectValue(businessHours: BusinessHours) {
    cy.wrap(businessHours.getOpenHours()).each(
      (openHour: any, index: number) => {
        openHour = openHour as OpenHour;
        const openHourViewPO = new OpenHourViewPageObjectCypress(
          `${this.getSelector()} [index="${index}"]`
        );
        openHourViewPO.expectValue(openHour);
      }
    );
  }
}
