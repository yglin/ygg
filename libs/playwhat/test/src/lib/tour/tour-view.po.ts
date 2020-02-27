import * as moment from 'moment';
import { Album } from '@ygg/shared/omni-types/core';
import { User } from '@ygg/shared/user';
import { TheThing } from '@ygg/the-thing/core';
import { TourViewPageObject, PlayCardPageObject } from '@ygg/playwhat/ui';
import { AlbumViewPageObjectCypress } from '@ygg/shared/omni-types/test';

class PlayCardPageObjectCypress extends PlayCardPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('exist');
  }

  expectValue(play: TheThing) {
    cy.get(this.getSelector('name')).should('include.text', play.name);
    cy.get(this.getSelector('subtitle')).should(
      'include.text',
      play.cells['副標題'].value
    );
    cy.get(this.getSelector('intro')).should(
      'include.text',
      play.cells['簡介'].value
    );
    cy.get(this.getSelector('price')).should(
      'include.text',
      play.cells['費用'].value
    );
    cy.get(this.getSelector('minParticipants')).should(
      'include.text',
      play.cells['人數下限'].value
    );
    cy.get(this.getSelector('maxParticipants')).should(
      'include.text',
      play.cells['人數上限'].value
    );

    const humanizedDuration = moment
      .duration(play.cells['時長'].value, 'minutes')
      .locale('zh-tw')
      .humanize();
    cy.get(this.getSelector('timeLength')).should('include.text', humanizedDuration);

    const album: Album = play.cells['照片'].value;
    const albumViewPO = new AlbumViewPageObjectCypress(
      this.getSelector('album')
    );
    albumViewPO.expectValue(album);
  }
}

export class TourViewPageObjectCypress extends TourViewPageObject {
  expectVisible() {
    cy.get(this.getSelector()).scrollIntoView();
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
    playCardPO.expectVisible();
    playCardPO.expectValue(play);
  }
}
