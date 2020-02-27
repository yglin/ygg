import { PageObject } from '@ygg/shared/test/page-object';
import { ImageThumbnailItem } from '../image-thumbnail';

export abstract class ImageThumbnailItemPageObject extends PageObject {
  selectors = {
    main: '.image-thumbnail',
    image: '.image',
    name: '.name'
  };

  abstract expectValue(item: ImageThumbnailItem): void;
  abstract expectVisible(): void;
}
