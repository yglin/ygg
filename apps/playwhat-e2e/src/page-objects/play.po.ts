import { isEmpty } from 'lodash';
import { Play, PlayFormGroupModel } from '@ygg/playwhat/play';
import { FormControlType, FormControlModel } from '@ygg/shared/ui/dynamic-form';
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
import { Addition } from '@ygg/resource/core';
import {
  AdditionEditPageObjectCypress,
  AdditionThumbnailPageObjectCypress
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
    buttonAddAddition: 'button.add-addition',
    buttonClearAdditions: 'button.clear-additions',
    additionList: '.addition-list'
  };

  getSelectorForControl(model: FormControlModel): string {
    return `#form-control-${model.name}`;
  }

  getSelectorForDeleteAdditions(): string {
    return `${this.getSelector('additionList')} button.delete`;
  }

  getSelectorForDeleteAdditionAt(index: number): string {
    return `${this.getSelector(
      'additionList'
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
    const formModel = PlayFormGroupModel;
    for (const name in formModel.controls) {
      if (formModel.controls.hasOwnProperty(name)) {
        const controlModel = formModel.controls[name];
        let valueSelector = '';
        switch (controlModel.type) {
          case FormControlType.text:
            valueSelector = `${this.getSelectorForControl(controlModel)} input`;
            cy.get(`${this.selector} ${valueSelector}`)
              .clear()
              .type(play[controlModel.name]);
            break;
          case FormControlType.number:
            valueSelector = `${this.getSelectorForControl(controlModel)} input`;
            cy.get(`${this.selector} ${valueSelector}`)
              .clear()
              .type(play[controlModel.name].toString());
            break;
          case FormControlType.textarea:
            valueSelector = `${this.getSelectorForControl(controlModel)} textarea`;
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
    this.clearAdditions(play.additions);
    cy.wrap(play.additions).each((eq: Addition, index: number) => {
      this.addAddition(eq);
      this.expectAddition(eq, index);
    });
    const tagsControlPO = new TagsControlPageObjectCypress();
    tagsControlPO.setValue(play.tags);
  }

  clearAdditions(additions: Addition[]) {
    cy.get(this.getSelector('buttonClearAdditions')).click({
      force: true
    });
    cy.get(this.getSelector(`.addition-list .addition`)).should('not.exist');
  }

  addAddition(addition: Addition) {
    cy.get(this.getSelector('buttonAddAddition')).click();
    const additionEditPO = new AdditionEditPageObjectCypress('');
    additionEditPO.expectVisible();
    additionEditPO.setValue(addition);
    additionEditPO.submit();
  }

  expectAddition(addition: Addition, index: number) {
    const additionThumbnailPageObject = new AdditionThumbnailPageObjectCypress(
      this.getSelector(`.addition-list [index="${index}"]`)
    );
    additionThumbnailPageObject.expectValue(addition);
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

  getSelectorForAdditionAt(index: number): string {
    return `${this.selector} .addition-list [index="${index}"]`;
  }

  expectVisible() {
    cy.get(this.selector).should('be.visible');
  }

  expectCreator(user: User) {
    cy.log(`Expect the creator is ${user.name}`);
    cy.get('.creator').contains(user.name);
  }

  checkData(play: Play) {
    const formModel = PlayFormGroupModel;
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
          case FormControlType.number:
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
    cy.wrap(play.additions).each((addition: Addition, index: number) => {
      const additionThumbnailPageObject = new AdditionThumbnailPageObjectCypress(
        this.getSelectorForAdditionAt(index)
      );
      additionThumbnailPageObject.expectValue(addition);
    });
  }
}
