import { Play } from '@ygg/playwhat/play';
import { FormControlType } from '@ygg/shared/types';
import { AlbumControlPageObject, AlbumViewPageObject } from './album.po';
import { BusinessHoursControlPageObject, BusinessHoursViewPageObject } from "./business-hours.po";

export class PlayFormPageObject {
  selector: string;
  albumControl: AlbumControlPageObject;
  businessHoursControl: BusinessHoursControlPageObject;

  constructor(parentSelector: string = '') {
    this.selector = `${parentSelector} form#play-form`.trim();
    this.albumControl = new AlbumControlPageObject(this.selector);
    this.businessHoursControl = new BusinessHoursControlPageObject(
      this.selector
    );
  }

  expectVisible() {
    cy.get(this.selector).should('be.visible');
  }

  fillIn(play: Play) {
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
            this.albumControl.fillIn(play.album);
            break;
          case FormControlType.businessHours:
            this.businessHoursControl.fillIn(play.businessHours);
            break;
          default:
            cy.log(
              `Can not find fillIn method for control type = ${controlModel.type}`
            );
            break;
        }
      }
    }
  }

  submit() {
    cy.get(`${this.selector} button#submit`).click();
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
            this.businessHoursView.checkData(play[name]);
            break;
          default:
            cy.log(
              `Can not find fillIn method for control type = ${controlModel.type}`
            );
            break;
        }
      }
    }
  }
}
