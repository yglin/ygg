import { login, logout } from '../support/app.po';
import { Play } from '@ygg/playwhat/play';

describe('plays', () => {
  const testPlay = Play.forge();

  beforeEach(function() {
    cy.visit('/');
    login();
  });

  // it('should show button "add-my-play" in home page, and link to the page of creating new play', () => {
  //   cy.get('a#add-my-play').should('have.text', '新增我的體驗');
  //   cy.get('a#add-my-play').click();
  //   cy.url().should('match', /.*\/plays\/new$/);
  //   cy.get('form#play-form').should('be.visible');
  // });

  it('should create new Play and check data consistency', () => {
    cy.visit('/plays/new');
    fillInPlay(testPlay, { submit: true });
    // should redirect to play-view
    cy.location()
    .should((loc) => {
      expect(loc.pathname).not.match(/plays\/new/);
      expect(loc.pathname).match(/\/plays\/([^/]+)$/);
    })
    .then((loc) => {
      cy.get('#play-view').should('be.visible');
      checkDataInPlayView(testPlay);
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

  function fillInPlay(play: Play, options: any = {}) {
    const textFields = ['name'];
    const formSelector = 'form#play-form';
    for (const fieldName of textFields) {
      const inputSelector = `input#${fieldName}`;
      cy.get(`${formSelector} ${inputSelector}`).type(play.name);
    }

    if (options.submit) {
      cy.get(`${formSelector} button#submit`).click();
    }
  }

  function checkDataInPlayView(play: Play) {
    const textFields = ['name'];
    const containerSelector = '#play-view';
    for (const fieldName of textFields) {
      const value = play[fieldName];
      cy.get(`${containerSelector} #${fieldName} .value`).contains(value);
    }
  }

  function deletePlayInDB(playId: string) {
    // TODO delete play document in database
    // @ts-ignore
    cy.callFirestore('delete', `plays/${playId}`);
  }
});
