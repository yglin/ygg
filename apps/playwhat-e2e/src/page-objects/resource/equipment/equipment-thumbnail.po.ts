import { EquipmentThumbnailPageObject } from "@ygg/resource/ui";
import { Equipment } from '@ygg/resource/core';

export class EquipmentThumbnailPageObjectCypress extends EquipmentThumbnailPageObject {
  expectValue(equipment: Equipment) {
    cy.get(this.getSelector('name')).should('include.text', equipment.name);
    cy.get(this.getSelector('stock')).should('include.text', equipment.stock);
    cy.get(this.getSelector('price')).should('include.text', equipment.price);
  }
}