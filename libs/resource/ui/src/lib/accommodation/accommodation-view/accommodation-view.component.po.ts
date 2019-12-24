import { PageObject } from "@ygg/shared/test/page-object";

export class AccommodationViewPageObject extends PageObject {
  selectors = {
    main: '.accommodation-view',
    name: '.name',
    album: '.album',
    introduction: '.introduction',
    location: '.location',
    links: '.links'
  }

  getSelectorForLinkAt(index: number) {
    return `${this.getSelector("links")} [link-index="${index}"]`;
  }
}