import { PageObject } from '@ygg/shared/test/page-object';

export class AlbumControlPageObject extends PageObject {
  selectors = {
    main: '.album-control',
    buttonClearAll: '#clear-all',
    addPhotots: '#add-photos'
  };

  getSelectorForPhoto(src: string) {
    return `${this.getSelector()} .photo-list img[src="${src}"]`;
  }
}
