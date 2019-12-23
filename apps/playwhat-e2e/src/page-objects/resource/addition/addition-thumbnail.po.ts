import { AdditionThumbnailPageObject } from "@ygg/resource/ui";
import { Addition } from '@ygg/resource/core';

export class AdditionThumbnailPageObjectCypress extends AdditionThumbnailPageObject {
  expectValue(addition: Addition) {
    cy.get(this.getSelector('name')).should('include.text', addition.name);
    cy.get(this.getSelector('stock')).should('include.text', addition.stock);
    cy.get(this.getSelector('price')).should('include.text', addition.price);
  }
}