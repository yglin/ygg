import { TheThingCellViewPageObject } from '@ygg/the-thing/ui';
import { TheThingCell } from '@ygg/the-thing/core';
import {
  AlbumViewPageObjectCypress,
  HtmlViewPageObjectCypress,
  AddressViewPageObjectCypress,
  DateRangeViewPageObjectCypress,
  DayTimeRangeViewPageObjectCypress
} from '@ygg/shared/omni-types/test';

export class TheThingCellViewPageObjectCypress extends TheThingCellViewPageObject {
  expectValue(cell: TheThingCell) {
    switch (cell.type) {
      case 'text':
        cy.get(this.getSelector()).contains(cell.value);
        break;

      case 'longtext':
        cy.get(this.getSelector()).contains(cell.value);
        break;

      case 'number':
        cy.get(this.getSelector()).contains(cell.value.toString());
        break;

      case 'album':
        const albumViewPO = new AlbumViewPageObjectCypress(this.getSelector());
        albumViewPO.expectValue(cell.value);
        break;

      case 'html':
        const htmlViewPO = new HtmlViewPageObjectCypress(this.getSelector());
        htmlViewPO.expectValue(cell.value);
        break;

      case 'address':
        const addressViewPO = new AddressViewPageObjectCypress(
          this.getSelector()
        );
        addressViewPO.expectValue(cell.value);
        break;

      case 'date-range':
        const dateRangeViewPO = new DateRangeViewPageObjectCypress(
          this.getSelector()
        );
        dateRangeViewPO.expectValue(cell.value);
        break;

      case 'day-time-range':
        const dayTimeRangeViewPO = new DayTimeRangeViewPageObjectCypress(
          this.getSelector()
        );
        dayTimeRangeViewPO.expectValue(cell.value);
        break;

      default:
        break;
    }
  }
}
