import { cloneDeep } from "lodash";
import { FormArrayPageObject, FormControlModel } from "@ygg/shared/ui/dynamic-form";
import { FormControlPageObjectCypress } from "./dynamic-form-control.po";

export class FormArrayPageObjectCypress extends FormArrayPageObject {
  setValue(model: FormControlModel, valueArray: Array<any>) {
    this.clearAll();
    const iteratorModel = cloneDeep(model);
    iteratorModel.isArray = false;
    for (let index = 0; index < valueArray.length; index++) {
      this.addControl();
      const value = valueArray[index];
      iteratorModel.name = index.toString();
      const formControlPO = new FormControlPageObjectCypress(this.getSelectorForControlAt(index));
      formControlPO.setValue(iteratorModel, value);
    }
  }

  clearAll() {
    cy.get(this.getSelector('buttonClearAll')).click();
    cy.get(this.getSelector()).find('.sub-control').should('not.exist');
  }

  addControl() {
    cy.get(this.getSelector('buttonAdd')).click();
  }
}