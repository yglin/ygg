import { AccommodationControlPageObject } from "@ygg/resource/ui";
import { Accommodation, AccommodationFormGroupModel } from '@ygg/resource/core';
import { DynamicFormPageObjectCypress } from "../../dynamic-form";

export class AccommodationControlPageObjectCypress extends AccommodationControlPageObject {
  dynamicFormPO: DynamicFormPageObjectCypress;

  constructor(parentSelector: string) {
    super(parentSelector);
    this.dynamicFormPO = new DynamicFormPageObjectCypress(this.getSelector());
  }

  setValue(accommodation: Accommodation) {
    this.dynamicFormPO.setValue(AccommodationFormGroupModel, accommodation);
  }

  submit() {
    this.dynamicFormPO.submit();
  }
}