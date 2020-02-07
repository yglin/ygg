import { PageObject } from '@ygg/shared/test/page-object';
import { ImageThumbnailItem } from '../image-thumbnail';

export abstract class ImageThumbnailSelectorPageObject extends PageObject {
  selectors = {
    main: '.image-thumbnail-selector',
    buttonSubmit: 'button.submit'
  };

  abstract selectItem(item: ImageThumbnailItem): void;
  abstract expectItems(items: ImageThumbnailItem[]): void;

  getSelectorForItem(item: ImageThumbnailItem): string {
    return `${this.getSelector()} [item-id=${item.id}]`;
  }
}
