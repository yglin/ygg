import { PageObject } from '@ygg/shared/test/page-object';
import { Equipment,  } from '@ygg/resource/core';
import { AlbumControlPageObject } from '../../album.po';
import { DynamicFormPageObjectCypress } from "../../dynamic-form";
import { EquipmentFormGroupModel } from "@ygg/resource/factory";

export class EquipmentEditPageObjectCypress extends PageObject {
  selectors = {
    main: '.equipment-control'
  }
  dynamicForm: DynamicFormPageObjectCypress;

  constructor(parentSelector: string) {
    super(parentSelector);
    this.dynamicForm = new DynamicFormPageObjectCypress(this.getSelector());
  }

  expectVisible() {
    cy.get(this.dynamicForm.getSelector('buttonSubmit')).should('be.visible');
  }

  setValue(equipment: Equipment) {
    this.dynamicForm.setValue(EquipmentFormGroupModel, equipment);
  }

  submit() {
    this.dynamicForm.submit();
  }
}