import { ImitationViewDogPageObject } from '@ygg/the-thing/ui';
import { TheThingValidateError, TheThingCell } from '@ygg/the-thing/core';
import { TheThingCellViewPageObjectCypress } from '../cell';

export class ImitationViewDogPageObjectCypress extends ImitationViewDogPageObject {
  expectVisibale() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectNoError() {
    cy.get(`${this.getSelector('validateErrors')} .error`).should('not.exist');
  }

  expectCell(cell: TheThingCell) {
    const cellViewPO = new TheThingCellViewPageObjectCypress(this.getSelectorForCell(cell));
    cellViewPO.expectValue(cell.value);
  }

  expectCells(cells: TheThingCell[]) {
    cy.wrap(cells).each((cell: any) => {
      this.expectCell(cell);
    });
  }
}
