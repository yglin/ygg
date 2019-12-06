import {
  DynamicFormPageObject,
  FormGroupModel,
  FormGroupValue,
  FormControlModel,
  FormControlType
} from '@ygg/shared/ui/dynamic-form';
import { AlbumControlPageObject } from '../album.po';
import { LocationControlPageObjectCypress } from '../shared-types/location';

export class DynamicFormPageObjectCypress extends DynamicFormPageObject {
  setValue(formGroupModel: FormGroupModel, value: FormGroupValue) {
    for (const key in value) {
      if (
        value.hasOwnProperty(key) &&
        formGroupModel.controls.hasOwnProperty(key)
      ) {
        const propertyValue = value[key];
        const controlModel = formGroupModel.controls[key];
        this.setControlValue(controlModel, propertyValue);
      }
    }
  }

  setControlValue(controlModel: FormControlModel, value: any) {
    switch (controlModel.type) {
      case FormControlType.text:
        cy.get(this.getSelectorForControl(controlModel))
          .find('input')
          .clear()
          .type(value);
        break;

      case FormControlType.textarea:
        cy.get(this.getSelectorForControl(controlModel))
          .find('textarea')
          .clear()
          .type(value);
        break;

      case FormControlType.album:
        const albumControlPO = new AlbumControlPageObject(
          this.getSelectorForControl(controlModel)
        );
        albumControlPO.setValue(value);
        break;

      case FormControlType.location:
        const locationControlPO = new LocationControlPageObjectCypress(
          this.getSelectorForControl(controlModel)
        );
        locationControlPO.setValue(value);
        break;

      default:
        cy.log(`Unknown control type: ${controlModel.type}`);
        break;
    }
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click({ force: true });
  }
}
