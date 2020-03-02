import { PageObject } from '@ygg/shared/test/page-object';
import { Album } from '@ygg/shared/omni-types/core';

export abstract class AlbumViewPageObject extends PageObject {
  selectors = {
    main: '.album-view',
    coverImg: '.cover img'
  };

  getSelectorForPhotoAt(index: number): string {
    return `${this.getSelector()} .photo-list [photo-index="${index}"] img`;
  }

  abstract expectValue(album: Album);
}
