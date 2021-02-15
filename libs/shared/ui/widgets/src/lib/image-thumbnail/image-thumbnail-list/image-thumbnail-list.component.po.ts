import { PageObject } from '@ygg/shared/test/page-object';
import { ImageThumbnailItem } from '../image-thumbnail';
import { ImageThumbnailItemPageObject } from '../image-thumbnail-item/image-thumbnail.component.po';

export abstract class ImageThumbnailListPageObject extends PageObject {
  selectors = {
    main: '.image-thumbnail-list',
    firstItem: '.first-item',
    lastItem: '.last-item',
    buttonSubmit: 'button.submit',
    buttonSelectAll: 'button.select-all',
    buttonClearSelection: 'button.clear-selection',
    selectionHint: '.selection-hint'
  };

  // getSelectorForSelectedItem(item: ImageThumbnailItem): string {
  //   return `${this.getSelector('selection')} .item:contains("${item.name}")`;
  // }

  getSelectorForItem(item?: ImageThumbnailItem): string {
    if (item === undefined) {
      return `${this.getSelector()} .item`;
    } else {
      const selector = `${this.getSelector()} .item:contains("${item.name}")`;
      // if (!!item.image) {
      //   selector += ` img[src="${item.image}"]`;
      // }
      return selector;
    }
  }

  // getSelectorForItemLink(item: ImageThumbnailItem): string {
  //   return `${this.getSelectorForItem(item)} .open-link`;
  // }

  // getSelectorForDeleteItem(item: ImageThumbnailItem): string {
  //   return `${this.getSelectorForItem(item)} .delete button`;
  // }

  abstract getItem(item: ImageThumbnailItem): any;
  abstract getItemPageObject(
    item: ImageThumbnailItem
  ): ImageThumbnailItemPageObject;
  abstract expectItem(item: ImageThumbnailItem): void;
  abstract expectItems(items: ImageThumbnailItem[]): void;
  abstract expectNoItems(objects: ImageThumbnailItem[]): void;
  abstract expectEmpty(): void;
  abstract selectItem(item: ImageThumbnailItem): void;
  abstract selectItems(items: ImageThumbnailItem[]): void;
  abstract selectAll(): void;
  abstract clearSelection(): void;
}
