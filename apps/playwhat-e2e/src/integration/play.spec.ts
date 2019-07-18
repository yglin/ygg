import { login, logout } from "../support/app.po";

describe('plays', () => {
  beforeEach(function() {
    cy.visit('/');
    login();
  });
  
  it('should show button "add-my-play" in home page, and link to the page of creating new play', () => {
    cy.get('a#add-my-play').should('have.text', '新增我的體驗');
    cy.get('a#add-my-play').click();
    cy.url().should('match', /.*\/plays\/new$/);
    cy.get('form#play-form').should('be.visible');
  });

  // it('should create new Play and check data consistency', () => {
  //   cy.visit('/plays/new');
  //   const newPlay = Play.forge();
  //   submitPlay(newPlay);
  //   // should redirect to play-view
  //   const regex = new RegExp(`.*\/plays\/${newPlay.id}$`);
  //   cy.url().should('match', regex);
  //   checkDataInPlayView(newPlay);
  // });
  
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
  
});