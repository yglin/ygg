import { PageObject } from '@ygg/shared/test/page-object';
import { ImageThumbnailItem } from '../image-thumbnail';

export type ImageThumbnailItemSize = 'small' | 'medium' | 'big';

export abstract class ImageThumbnailItemPageObject extends PageObject {
  selectors = {
    main: '.image-thumbnail',
    image: '.image',
    name: '.name',
    buttonOpenLink: '.open-link button'
  };

  abstract expectValue(item: ImageThumbnailItem): void;
  abstract expectVisible(): void;
  abstract clickLink(): void;
}
