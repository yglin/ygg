import { PageObject } from "@ygg/shared/test/page-object";

export class AlbumViewPageObject extends PageObject {
  selectors = {
    main: '.album-view',
    coverImg: '.cover img'
  }

  getSelectorForPhotoAt(index: number): string {
    return `${this.getSelector()} .photo-list [photo-index="${index}"] img`;
  }
}