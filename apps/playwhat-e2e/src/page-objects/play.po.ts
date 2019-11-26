import { isEmpty } from 'lodash';
import { Play } from '@ygg/playwhat/play';
import { FormControlType } from '@ygg/shared/ui/dynamic-form';
import { AlbumControlPageObject, AlbumViewPageObjectCypress } from './album.po';
import {
  BusinessHoursControlPageObject,
  BusinessHoursViewPageObject
} from './business-hours.po';
import { PageObject } from './page-object.po';
// import { PageObjects } from '@ygg/shared/types';
// import { AngularCypressTester } from '@ygg/shared/infra/test-utils/cypress';
import { Location } from './shared-types';
import {
  TagsControlPageObjectCypress,
  TagsViewPageObjectCypress
} from './tags';
import { User } from '@ygg/shared/user';
import { Equipment } from '@ygg/resource/core';
import {
  EquipmentEditPageObjectCypress,
  EquipmentThumbnailPageObjectCypress
} from './resource';

export function deletePlay(play: Play) {
  // @ts-ignore
  cy.callFirestore('delete', `plays/${play.id}`);
  // delete play tags
  cy.wrap(play.tags.toTagsArray()).each((element, index, array) => {
    // @ts-ignore
    cy.callFirestore('delete', `tags/${(element as Tag).id}`);
  });
}

export class PlayFormPageObject extends PageObject {
  selector = '.ygg-play-form';
  selectors = {
    buttonSubmit: 'button#submit',
    buttonAddEquipment: 'button.add-equipment',
    buttonClearEquipments: 'button.clear-equipments',
    equipmentList: '.equipment-list'
  };

  getSelectorForDeleteEquipments(): string {
    return `${this.getSelector('equipmentList')} button.delete`;
  }

  getSelectorForDeleteEquipmentAt(index: number): string {
    return `${this.getSelector(
      'equipmentList'
    )} [index="${index}"] button.delete`;
  }

  constructor(parentSelector: string = '') {
    super(parentSelector);
  }

  expectVisible() {
    cy.get(this.selector).should('be.visible');
  }

  fillIn(play: Play) {
    // const tester = new AngularCypressTester({});
    const formModel = Play.getFormGroupModel();
    for (const name in formModel.controls) {
      if (formModel.controls.hasOwnProperty(name)) {
        const controlModel = formModel.controls[name];
        let valueSelector = '';
        switch (controlModel.type) {
          case FormControlType.text:
            valueSelector = `#${controlModel.name} input`;
            cy.get(`${this.selector} ${valueSelector}`)
              .clear()
              .type(play[controlModel.name]);
            break;
          case FormControlType.textarea:
            valueSelector = `#${controlModel.name} textarea`;
            cy.get(`${this.selector} ${valueSelector}`)
              .clear()
              .type(play[controlModel.name]);
            break;
          case FormControlType.album:
            const albumControl = new AlbumControlPageObject(
              `${this.getSelector()} #form-control-${name}`
            );
            albumControl.setValue(play.album);
            break;
          case FormControlType.businessHours:
            const businessHoursControl = new BusinessHoursControlPageObject(
              `${this.getSelector()} #form-control-${name}`
            );
            businessHoursControl.setValue(play.businessHours);
            break;
          case FormControlType.location:
            const locationControl = new Location.LocationControlPageObjectCypress(
              `${this.getSelector()} #form-control-${name}`
            );
            locationControl.setValue(play.location);
            break;
          // case FormControlType.tags:
          //   const tagsControl = new PlaywhatTagPageObjects.TagsControlComponentPageObject(
          //     tester,
          //     `${this.getSelector()} #form-control-${name}`
          //   );
          //   tagsControl.setValue(play.tags);
          //   break;
          default:
            cy.log(
              `Can not find fillIn method for control type = ${controlModel.type}`
            );
            break;
        }
      }
    }
    this.clearEquipments(play.equipments);
    cy.wrap(play.equipments).each((eq: Equipment, index: number) => {
      this.addEquipment(eq);
      this.expectEquipment(eq, index);
    });
    const tagsControlPO = new TagsControlPageObjectCypress();
    tagsControlPO.setValue(play.tags);
  }

  clearEquipments(equipments: Equipment[]) {
    cy.get(this.getSelector('buttonClearEquipments')).click({
      force: true
    });
    cy.get(this.getSelector(`.equipment-list .equipment`)).should('not.exist');
  }

  addEquipment(equipment: Equipment) {
    cy.get(this.getSelector('buttonAddEquipment')).click();
    const equipmentEditPO = new EquipmentEditPageObjectCypress('');
    equipmentEditPO.expectVisible();
    equipmentEditPO.setValue(equipment);
    equipmentEditPO.submit();
  }

  expectEquipment(equipment: Equipment, index: number) {
    const equipmentThumbnailPageObject = new EquipmentThumbnailPageObjectCypress(
      this.getSelector(`.equipment-list [index="${index}"]`)
    );
    equipmentThumbnailPageObject.expectValue(equipment);
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}

export class PlayViewPageObject {
  selector: string;
  albumView: AlbumViewPageObjectCypress;
  businessHoursView: BusinessHoursViewPageObject;

  constructor(parentSelector: string = '') {
    this.selector = `${parentSelector} .play-view`.trim();
    this.albumView = new AlbumViewPageObjectCypress(this.selector);
    this.businessHoursView = new BusinessHoursViewPageObject(this.selector);
  }

  getSelectorForEquipmentAt(index: number): string {
    return `${this.selector} .equipment-list [index="${index}"]`;
  }

  expectVisible() {
    cy.get(this.selector).should('be.visible');
  }

  expectCreator(user: User) {
    cy.log(`Expect the creator is ${user.name}`);
    cy.get('.creator').contains(user.name);
  }

  checkData(play: Play) {
    const formModel = Play.getFormGroupModel();
    // const tester = new AngularCypressTester({});
    for (const name in formModel.controls) {
      if (
        formModel.controls.hasOwnProperty(name) &&
        play.hasOwnProperty(name)
      ) {
        const controlModel = formModel.controls[name];
        let valueSelector = '';
        switch (controlModel.type) {
          case FormControlType.text:
          case FormControlType.textarea:
            valueSelector = `#${controlModel.name} .value`;
            cy.get(`${this.selector} ${valueSelector}`).contains(
              play[name].toString()
            );
            break;
          case FormControlType.album:
            this.albumView.expectValue(play[name]);
            break;
          case FormControlType.businessHours:
            this.businessHoursView.expect(play[name]);
            break;
          case FormControlType.location:
            const locationView = new Location.LocationViewPageObjectCypress(
              this.selector
            );
            locationView.expectValue(play[name]);
            break;
          // case FormControlType.tags:
          //   const tagsView = new PageObjects.TagsViewComponentPageObject(
          //     tester,
          //     this.selector
          //   );
          //   tagsView.expectValue(play[name]);
          //   break;
          default:
            cy.log(
              `Can not find fillIn method for control type = ${controlModel.type}`
            );
            break;
        }
      }
    }
    // const tagsView = new TagsViewPageObjectCypress(`${this.selector}`);
    // tagsView.expectValue(play.tags);
    cy.wrap(play.equipments).each((equipment: Equipment, index: number) => {
      const equipmentThumbnailPageObject = new EquipmentThumbnailPageObjectCypress(
        this.getSelectorForEquipmentAt(index)
      );
      equipmentThumbnailPageObject.expectValue(equipment);
    });
  }
}
