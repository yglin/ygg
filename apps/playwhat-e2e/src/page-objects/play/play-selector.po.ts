import { PlaySelectorPageObject, Play } from "@ygg/playwhat/play";

export class PlaySelectorPageObjectCypress extends PlaySelectorPageObject {
  expectPlays(plays: Play[]) {
    cy.wrap(plays).each((play: Play) => {
      cy.get(this.getSelectorForPlay(play)).should('exist');
    });
  }

  clickPlay(play: Play) {
    cy.get(this.getSelectorForPlay(play)).click({force: true});
  }

  clickPlayById(playId: string) {
    cy.get(this.getSelectorForPlay(playId)).click({force: true});
  }

  clickPlays(plays: Play[]) {
    cy.wrap(plays).each((play: Play) => {
      this.clickPlay(play);
    });
  }
}