import { PageObject } from '@ygg/shared/test/page-object';
import { Equipment } from '@ygg/resource/core';
import { AlbumControlPageObject } from '../../album.po';

export class EquipmentEditPageObjectCypress extends PageObject {
  selectors = {
    main: '.dynamic-form[form-name="equipment-form"]',
    inputName: '.dynamic-control[control-name="name"] input',
    inputStock: '.dynamic-control[control-name="stock"] input',
    inputPrice: '.dynamic-control[control-name="price"] input',
    buttonSubmit: 'button.submit'
  }

  expectVisible() {
    cy.get(this.getSelector('buttonSubmit')).should('be.visible');
  }

  setValue(equipment: Equipment) {
    cy.get(this.getSelector('inputName')).clear().type(equipment.name);
    cy.get(this.getSelector('inputStock')).clear().type(equipment.stock.toString());
    cy.get(this.getSelector('inputPrice')).clear().type(equipment.price.toString());
    if (equipment.album) {
      const albumControlPageObject = new AlbumControlPageObject(this.getSelector());
      albumControlPageObject.setValue(equipment.album);
    }
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}