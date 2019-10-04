import { Play } from '@ygg/playwhat/play';
import { FormControlType } from '@ygg/shared/types';
import { AlbumControlPageObject, AlbumViewPageObject } from './album.po';
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

export class PlayFormPageObject extends PageObject {
  selector = '.play-form';
  selectors = {
    buttonSubmit: 'button#submit'
  };

  constructor(parentSelector: string = '') {
    super(parentSelector);
  }

  expectVisible() {
    cy.get(this.selector).should('be.visible');
  }

  fillIn(play: Play) {
    // const tester = new AngularCypressTester({});
    const formModel = Play.getFormModel();
    for (const name in formModel.controls) {
      if (formModel.controls.hasOwnProperty(name)) {
        const controlModel = formModel.controls[name];
        let valueSelector = '';
        switch (controlModel.type) {
          case FormControlType.text:
            valueSelector = `#${controlModel.name} input`;
            cy.get(`${this.selector} ${valueSelector}`).type(
              play[controlModel.name]
            );
            break;
          case FormControlType.textarea:
            valueSelector = `#${controlModel.name} textarea`;
            cy.get(`${this.selector} ${valueSelector}`).type(
              play[controlModel.name]
            );
            break;
          case FormControlType.album:
            const albumControl = new AlbumControlPageObject(
              `${this.getSelector()} #form-control-${name}`
            );
            albumControl.fillIn(play.album);
            break;
          case FormControlType.businessHours:
            const businessHoursControl = new BusinessHoursControlPageObject(
              `${this.getSelector()} #form-control-${name}`
            );
            businessHoursControl.fillIn(play.businessHours);
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
    const tagsControlPO = new TagsControlPageObjectCypress();
    tagsControlPO.setValue(play.tags);
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}

export class PlayViewPageObject {
  selector: string;
  albumView: AlbumViewPageObject;
  businessHoursView: BusinessHoursViewPageObject;

  constructor(parentSelector: string = '') {
    this.selector = `${parentSelector} .play-view`.trim();
    this.albumView = new AlbumViewPageObject(this.selector);
    this.businessHoursView = new BusinessHoursViewPageObject(this.selector);
  }

  expectVisible() {
    cy.get(this.selector).should('be.visible');
  }

  checkData(play: Play) {
    const formModel = Play.getFormModel();
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
            this.albumView.checkData(play[name]);
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
    const tagsView = new TagsViewPageObjectCypress(`${this.selector}`);
    tagsView.expectValue(play.tags);
  }
}
