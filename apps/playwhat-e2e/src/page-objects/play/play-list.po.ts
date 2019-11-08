import { Play, PlayListPageObject } from '@ygg/playwhat/play';

export class PlayListPageObjectCypress extends PlayListPageObject {
  expectPlay(play: Play) {
    cy.get(`[playId="${play.id}"]`).should('exist');
  }

  clickPlay(play: Play) {
    cy.get(`[playId="${play.id}"]`).click({ force: true });
  }
}
