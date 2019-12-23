import { PageObject } from '@ygg/shared/test/page-object';

export class AdditionThumbnailPageObject extends PageObject {
  selectors = {
    main: '.addition-thumbnail',
    name: '.name',
    stock: '.stock',
    price: '.price'
  }
}