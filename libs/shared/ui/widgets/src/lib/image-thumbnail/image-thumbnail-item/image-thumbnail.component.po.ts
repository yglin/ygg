import { PageObject } from '@ygg/shared/test/page-object';

export class ImageThumbnailPageObject extends PageObject {
  selectors = {
    main: '.image-thumbnail',
    image: '.image',
    name: '.name'
  };
}
