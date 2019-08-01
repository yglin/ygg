// import { sample } from "lodash";
// import { SerializableJSON } from '@ygg/shared/infra/data-access';
import { login } from '../page-objects/app.po';
import {
  PlayFormPageObject,
  PlayViewPageObject
} from '../page-objects/play.po';
import { Play } from '@ygg/playwhat/play';

describe('Play form, new and update play', () => {
  beforeEach(function() {
    cy.visit('/');
    login();
  });

  // it('should show button "add-my-play" in home page, and link to the page of creating new play', () => {
  //   cy.get('a#add-my-play').should('have.text', '新增我的體驗');
  //   cy.get('a#add-my-play').click();
  //   cy.url().should('match', /.*\/plays\/new$/);
  //   playFormPage.expectForm();
  // });

  it('should create new Play and check data consistency', () => {
    const testPlay = Play.forge();
    const playFormPage = new PlayFormPageObject();
    const playViewPage = new PlayViewPageObject();
    cy.get('a#add-my-play').click();
    playFormPage.expectVisible();
    playFormPage.fillIn(testPlay);
    playFormPage.submit();
    playViewPage.expectVisible();
    playViewPage.checkData(testPlay);
    // should redirect to play-view
    cy.location().then(loc => {
      // Clean out test data in Database
      const matched = loc.pathname.match(/\/plays\/(.+)/);
      const newPlayId = matched[1];
      cy.log(`Created play id = ${newPlayId}`);
      deletePlayInDB(newPlayId);
    });
  });

  // it('If not logged in, when submit, ask user to login', () => {
  //   logout();
  //   cy.visit('/plays/new');
  //   const newPlay = Play.forge();
  //   submitPlay(newPlay);
  //   cy.get('#login-dialog').should('be.visible');
  //   login();
  //   const regex = new RegExp(`.*\/plays\/${newPlay.id}$`);
  //   cy.url().should('match', regex);
  //   checkOwnerInPlayView(testUID);
  // });

  // function fillInPlay(play: Play, options: any = {}) {
  //   const formModel = Play.getFormModel();
  //   const formSelector = `form#${formModel.name}`;
  //   for (const name in formModel.controls) {
  //     if (formModel.controls.hasOwnProperty(name)) {
  //       const controlModel = formModel.controls[name];
  //       let inputSelector = '';
  //       switch (controlModel.type) {
  //         case FormControlType.text:
  //           inputSelector = `#${controlModel.name} input`;
  //           cy.get(`${formSelector} ${inputSelector}`).type(
  //             play[controlModel.name]
  //           );
  //           break;
  //         case FormControlType.textarea:
  //           inputSelector = `#${controlModel.name} textarea`;
  //           cy.get(`${formSelector} ${inputSelector}`).type(
  //             play[controlModel.name]
  //           );
  //           break;
  //         case FormControlType.album:
  //           inputSelector = `#${controlModel.name} ygg-album-control`;
  //           fillInAlbum(inputSelector, play.album);
  //           break;
  //         default:
  //           cy.log(
  //             `Can not find fillIn method for control type = ${controlModel.type}`
  //           );
  //           break;
  //       }
  //     }
  //   }

  //   if (options.submit) {
  //     cy.get(`${formSelector} button#submit`).click();
  //   }
  // }

  // function checkDataInPlayView(play: Play) {
  //   const formModel = Play.getFormModel();
  //   const viewSelector = '#play-view';
  //   for (const name in formModel.controls) {
  //     if (formModel.controls.hasOwnProperty(name)) {
  //       const controlModel = formModel.controls[name];
  //       const value = play[controlModel.name];
  //       switch (controlModel.type) {
  //         case FormControlType.text:
  //         case FormControlType.textarea:
  //           cy.get(`${viewSelector} #${controlModel.name} .value`).contains(
  //             value
  //           );
  //           break;
  //         case FormControlType.album:
  //           const containerSelector = `${viewSelector} #${controlModel.name} ygg-album`;
  //           checkAlbumData(containerSelector, play.album);
  //           break;
  //         default:
  //           cy.log(
  //             `Can not find fillIn method for control type = ${controlModel.type}`
  //           );
  //           break;
  //       }
  //     }
  //   }
  // }

  function deletePlayInDB(playId: string) {
    // @ts-ignore
    cy.callFirestore('delete', `plays/${playId}`);
  }
});
