import {
  FormControlPageObject,
  FormControlModel,
  FormControlType
} from '@ygg/shared/ui/dynamic-form';
import { AlbumControlPageObject } from '../album.po';
import { LocationControlPageObjectCypress } from '../shared-types/location';
import { LinkControlPageObjectCypress } from '../shared-types/link';

export class FormControlPageObjectCypress extends FormControlPageObject {
  setValue(model: FormControlModel, value: any) {
    switch (model.type) {
      case FormControlType.text:
        cy.get(this.getSelector())
          .find('input')
          .clear()
          .type(value);
        break;

      case FormControlType.textarea:
        cy.get(this.getSelector())
          .find('textarea')
          .clear()
          .type(value);
        break;

      case FormControlType.number:
        cy.get(this.getSelector())
          .find('input')
          .clear()
          .type(value.toString());
        break;

      case FormControlType.album:
        const albumControlPO = new AlbumControlPageObject(this.getSelector());
        albumControlPO.setValue(value);
        break;

      case FormControlType.location:
        const locationControlPO = new LocationControlPageObjectCypress(
          this.getSelector()
        );
        locationControlPO.setValue(value);
        break;

      case FormControlType.link:
        const linkControlPO = new LinkControlPageObjectCypress(
          this.getSelector()
        );
        linkControlPO.setValue(value);
        break;

      default:
        cy.log(`Unknown control type: ${model.type}`);
        break;
    }
  }
}
