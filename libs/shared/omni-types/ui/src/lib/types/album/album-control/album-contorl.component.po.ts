import { PageObject } from '@ygg/shared/test/page-object';

export class AlbumControlPageObject extends PageObject {
  selectors = {
    main: '.album-control',
    buttonClearAll: '#clear-all',
    addPhotots: '#add-photos',
    cover: '.cover'
  };

  getSelectorForCover(src: string) {
    return `${this.getSelector('cover')} img[src="${src}"]`;   
  }

  getSelectorForPhoto(src: string) {
    return `${this.getSelector()} .photo-list img[src="${src}"]`;
  }
}
