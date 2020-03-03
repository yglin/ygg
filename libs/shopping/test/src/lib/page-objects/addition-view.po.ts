import { AdditionViewPageObject } from '@ygg/shopping/ui';
import { TheThing } from '@ygg/the-thing/core';
import { CellNameStock, CellNamePrice } from '@ygg/shopping/core';

export class AdditionViewPageObjectCypress extends AdditionViewPageObject {
  expectValue(addition: TheThing) {
    cy.get(this.getSelector('name')).should('include.text', addition.name);
    cy.get(this.getSelector('stock')).should('include.text', addition.getCellValue(CellNameStock));
    cy.get(this.getSelector('price')).should('include.text', addition.getCellValue(CellNamePrice));
  }

}
