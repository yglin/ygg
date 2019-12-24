import { Accommodation } from "@ygg/resource/core";
import { AccommodationViewPageObject } from "@ygg/resource/ui";
import { AlbumViewPageObjectCypress } from "../../album.po";
import { LocationViewPageObjectCypress } from "../../shared-types/location";
import { LinkViewPageObjectCypress } from "../../shared-types/link";

export class AccommodationViewPageObjectCypress extends AccommodationViewPageObject {
  expectValue(accommodation: Accommodation) {
    cy.get(this.getSelector('name')).contains(accommodation.name);
    cy.get(this.getSelector('introduction')).contains(accommodation.introduction);
    const albumViewPO = new AlbumViewPageObjectCypress(this.getSelector('album'));
    albumViewPO.expectValue(accommodation.album);
    const locationViewPO = new LocationViewPageObjectCypress(this.getSelector('location'));
    locationViewPO.expectValue(accommodation.location);
    for (let index = 0; index < accommodation.links.length; index++) {
      const link = accommodation.links[index];
      const linkViewPO = new LinkViewPageObjectCypress(this.getSelectorForLinkAt(index));
      linkViewPO.expectValue(link);
    }
  }
}