import { PageObject } from '@ygg/shared/test/page-object';
import { ImageThumbnailItem } from '../image-thumbnail';

export abstract class ImageThumbnailListPageObject extends PageObject {
  selectors = {
    main: '.image-thumbnail-list',
    firstItem: '.first-item',
    lastItem: '.last-item',
    buttonSubmit: 'button.submit',
    buttonClearSelection: 'button.clear-selection',
    selection: '.selection'
  };

  getSelectorForItem(item: ImageThumbnailItem): string {
    return `${this.getSelector()} [item-id=${item.id}]`;
  }

  getSelectorForItemLink(item: ImageThumbnailItem): string {
    return `${this.getSelector()} [item-id=${item.id}] .open-link`;
  }

  getSelectorForDeleteItem(item: ImageThumbnailItem): string {
    return `${this.getSelectorForItem(item)} .delete-item button`;
  }

  abstract expectItem(item: ImageThumbnailItem): void;
  abstract expectItems(items: ImageThumbnailItem[]): void;
  abstract selectItem(item: ImageThumbnailItem): void;
  abstract selectItems(items: ImageThumbnailItem[]): void;
  abstract clearSelection(): void;
}
