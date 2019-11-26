import { PageObject } from '@ygg/shared/test/page-object';

export class EquipmentThumbnailPageObject extends PageObject {
  selectors = {
    main: '.equipment-thumbnail',
    name: '.name',
    stock: '.stock',
    price: '.price'
  }
}