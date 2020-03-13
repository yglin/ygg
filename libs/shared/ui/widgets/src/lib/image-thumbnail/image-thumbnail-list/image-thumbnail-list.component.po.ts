import { PageObject } from '@ygg/shared/test/page-object';
import { ImageThumbnailItem } from '../image-thumbnail';

export abstract class ImageThumbnailListPageObject extends PageObject {
  selectors = {
    main: '.image-thumbnail-list',
    firstItem: '.first-item',
    lastItem: '.last-item',
    buttonSubmit: 'button.submit',
    buttonClearSelection: 'button.clear-selection',
    buttonDeleteSelection: 'button.delete-selection',
    selection: '.selection'
  };

  getSelectorForSelectedItem(item: ImageThumbnailItem): string {
    return `${this.getSelector('selection')} .item:contains("${item.name}")`;
  }

  getSelectorForItem(item?: ImageThumbnailItem): string {
    if (item === undefined) {
      return `${this.getSelector()} .item`;
    } else {
      return `${this.getSelector()} .item:contains("${item.name}")`;
    }
  }

  getSelectorForItemLink(item: ImageThumbnailItem): string {
    return `${this.getSelectorForItem(item)} .open-link`;
  }

  getSelectorForDeleteItem(item: ImageThumbnailItem): string {
    return `${this.getSelectorForItem(item)} .delete button`;
  }

  abstract expectItem(item: ImageThumbnailItem): void;
  abstract expectItems(items: ImageThumbnailItem[]): void;
  abstract expectNoItems(objects: ImageThumbnailItem[]): void;
  abstract expectEmpty(): void;
  abstract selectItem(item: ImageThumbnailItem): void;
  abstract selectItems(items: ImageThumbnailItem[]): void;
  abstract selectAll(): void;
  abstract deleteItem(item: ImageThumbnailItem): void;
  abstract deleteItems(items: ImageThumbnailItem[]): void;
  abstract clearSelection(): void;
}
