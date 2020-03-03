import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';

export abstract class RelationsEditorPageObject extends PageObject {
  selectors = {
    main: '.relations-editor',
    objectList: '.object-list',
    buttonCreateObject: 'button.create-object',
    buttonSelectObjects: 'button.select-objects'
  };
  imageThumbnailListPO: ImageThumbnailListPageObject;

  abstract expectRelationToSubject(
    relationName: string,
    subject: TheThing
  ): void;
  abstract expectObject(object: TheThing): void;
  abstract gotoCreateRelationObject(): void;
  abstract expectVisible(): void;
  deleteObject(object: TheThing) {
    this.imageThumbnailListPO.deleteItem(object);
  }
}
