import { TheThingCellsEditorPageObject } from '@ygg/the-thing/ui';
import { TheThingCell, TheThing } from '@ygg/the-thing/core';
import {
  AlbumControlPageObjectCypress,
  HtmlControlPageObjectCypress,
  AddressControlPageObjectCypress,
  DateRangeControlPageObjectCypress,
  DayTimeRangeControlPageObjectCypress
} from '@ygg/shared/omni-types/test';

export class TheThingCellsEditorPageObjectCypress extends TheThingCellsEditorPageObject {
  setCellValue(cell: TheThingCell) {
    switch (cell.type) {
      case 'text':
        cy.get(`${this.getSelectorForCellControl(cell)} input`)
          .clear({ force: true })
          .type(cell.value);
        break;
      case 'longtext':
        cy.get(`${this.getSelectorForCellControl(cell)} textarea`)
          .clear({ force: true })
          .type(cell.value);
        break;
      case 'number':
        cy.get(`${this.getSelectorForCellControl(cell)} input`)
          .clear({ force: true })
          .type(cell.value.toString());
        break;
      case 'album':
        const albumControlPO = new AlbumControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        albumControlPO.setValue(cell.value);
        break;
      case 'html':
        const htmlControlPO = new HtmlControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        htmlControlPO.setValue(cell.value);
        break;
      case 'address':
        const addressControlPO = new AddressControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        addressControlPO.setValue(cell.value);
        break;
      case 'date-range':
        const dateRangeControlPO = new DateRangeControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        // cy.log(cell.value);
        dateRangeControlPO.setValue(cell.value);
        break;
      case 'day-time-range':
        const dayTimeRangeControlPO = new DayTimeRangeControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        dayTimeRangeControlPO.setValue(cell.value);
        break;
      default:
        break;
    }
  }

  expectCellValue(cell: TheThingCell) {
    switch (cell.type) {
      case 'text':
        cy.get(`${this.getSelectorForCellControl(cell)} input`)
          .invoke('val')
          .should('equal', cell.value);
        break;
      case 'longtext':
        cy.get(`${this.getSelectorForCellControl(cell)} textarea`)
          .invoke('val')
          .should('equal', !!cell.value ? cell.value : '');
        break;
      case 'number':
        cy.get(`${this.getSelectorForCellControl(cell)} input[type="number"]`)
          .invoke('val')
          .should('equal', typeof cell.value === 'number' ? cell.value : '');
        break;
      case 'album':
        const albumControlPO = new AlbumControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        albumControlPO.expectValue(cell.value);
        break;
      case 'html':
        const htmlControlPO = new HtmlControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        htmlControlPO.expectValue(cell.value);
        break;
      case 'address':
        const addressControlPO = new AddressControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        addressControlPO.expectValue(cell.value);
        break;
      case 'date-range':
        const dateRangeControlPO = new DateRangeControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        // cy.log(cell.value);
        dateRangeControlPO.expectValue(cell.value);
        break;
      case 'day-time-range':
        const dayTimeRangeControlPO = new DayTimeRangeControlPageObjectCypress(
          this.getSelectorForCellControl(cell)
        );
        dayTimeRangeControlPO.expectValue(cell.value);
        break;
      default:
        break;
    }
  }

  clearAll() {
    cy.get(this.getSelector('deleteAll')).click({ force: true });
    cy.get(this.getSelectorForCellControl()).should('not.exist');
  }

  addCell(cell: TheThingCell) {
    cy.get(this.getSelector('inputCellName'))
      .clear({ force: true })
      .type(cell.name);
    cy.get(this.getSelector('selectCellType')).select(cell.type);
    cy.get(this.getSelector('buttonAddCell')).click();
    cy.get(this.getSelectorForCellControl(cell)).should('be.exist');
  }

  deleteCell(cell: TheThingCell) {
    cy.get(this.getSelectorForCellDeleteButton(cell)).click();
  }

  expectValue(cells: TheThingCell[]) {
    cy.wrap(cells).each((cell: any) => {
      this.expectCellValue(cell);
    });
  }

  setValue(cells: TheThingCell[]) {
    this.clearAll();
    cy.wrap(cells).each((cell: any) => {
      this.addCell(cell);
      this.setCellValue(cell);
    });
  }

  updateValue(cells: TheThingCell[]) {
    cy.wrap(cells).each((cell: any) => {
      this.setCellValue(cell);
    });
  }
}
