import { PageObject } from '@ygg/shared/test/page-object';
import { Addition,  } from '@ygg/resource/core';
import { AlbumControlPageObject } from '../../album.po';
import { DynamicFormPageObjectCypress } from "../../dynamic-form";
import { AdditionFormGroupModel } from "@ygg/resource/factory";

export class AdditionEditPageObjectCypress extends PageObject {
  selectors = {
    main: '.addition-control'
  }
  dynamicForm: DynamicFormPageObjectCypress;

  constructor(parentSelector: string) {
    super(parentSelector);
    this.dynamicForm = new DynamicFormPageObjectCypress(this.getSelector());
  }

  expectVisible() {
    cy.get(this.dynamicForm.getSelector('buttonSubmit')).should('be.visible');
  }

  setValue(addition: Addition) {
    this.dynamicForm.setValue(AdditionFormGroupModel, addition);
  }

  submit() {
    this.dynamicForm.submit();
  }
}