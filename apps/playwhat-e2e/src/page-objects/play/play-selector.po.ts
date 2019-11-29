import { PlaySelectorPageObject, Play } from '@ygg/playwhat/play';

export class PlaySelectorPageObjectCypress extends PlaySelectorPageObject {

  expectPlay(play: Play) {
    cy.get(this.getSelectorForPlay(play)).should('exist');
  }

  expectPlays(plays: Play[]) {
    cy.wrap(plays).each((play: Play) => {
      this.expectPlay(play);
    });
  }

  clickPlay(play: Play) {
    cy.get(this.getSelectorForPlay(play)).click({ force: true });
  }

  clickPlayById(playId: string) {
    cy.get(this.getSelectorForPlay(playId)).click({ force: true });
  }

  clickPlays(plays: Play[]) {
    cy.wrap(plays).each((play: Play) => {
      this.clickPlay(play);
    });
  }

  gotoCreatePlay() {
    cy.get(this.getSelector('buttonGotoCreatePlay')).click({ force: true });
  }
}
