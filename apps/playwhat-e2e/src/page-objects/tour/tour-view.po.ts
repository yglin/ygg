import * as moment from 'moment';
import { Album } from '@ygg/shared/types';
import { User } from '@ygg/shared/user';
import { TheThing } from '@ygg/the-thing/core';
import { TourViewPageObject, PlayCardPageObject } from '@ygg/playwhat/tour';

class PlayCardPageObjectCypress extends PlayCardPageObject {
  expectValue(play: TheThing) {
    cy.get(this.getSelector('name')).should('include', play.name);
    cy.get(this.getSelector('副標題')).should(
      'include',
      play.cells['副標題'].value
    );
    cy.get(this.getSelector('簡介')).should(
      'include',
      play.cells['簡介'].value
    );
    cy.get(this.getSelector('費用')).should(
      'include',
      play.cells['費用'].value
    );
    cy.get(this.getSelector('人數下限')).should(
      'include',
      play.cells['人數下限'].value
    );
    cy.get(this.getSelector('人數上限')).should(
      'include',
      play.cells['人數上限'].value
    );

    const humanizedDuration = moment
      .duration(play.cells['時長'].value, 'minutes')
      .humanize();
    cy.get(this.getSelector('時長')).should('include', humanizedDuration);

    const album: Album = play.cells['照片'].value;
    cy.wrap(album.photos).each((photo: any) => {
      cy.get(this.getSelector('照片')).find(`img[src="${photo.src}"]`).should('exist');
    });
  }
}

export class TourViewPageObjectCypress extends TourViewPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 20000 }).should('be.visible');
  }

  expectValue(tour: TheThing) {
    // this.expectTags(tour.tags.toIDArray());
    this.expectName(tour.name);
  }

  expectTags(tags: string[]) {
    cy.wrap(tags).each((tag: string) => {
      cy.get(this.getSelector('tags')).contains(tag);
    });
  }

  expectName(name: string) {
    cy.get(this.getSelector('name')).contains(name);
  }

  expectOwner(user: User) {
    cy.get(this.getSelector('owner')).contains(user.name);
  }

  expectPlays(plays: TheThing[]) {
    cy.wrap(plays).each((play: any) => this.expectPlay(play));
  }

  expectPlay(play: TheThing) {
    const playCardPO = new PlayCardPageObjectCypress(
      this.getSelectorForPlay(play)
    );
    playCardPO.expectValue(play);
  }
}
