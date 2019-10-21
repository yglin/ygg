import { Tags } from '@ygg/tags/core';

export * from './tags-admin-list.po';
export * from './tags-control.po';
export * from './tags-view.po';

export function deleteTags(tags: Tags) {
  cy.wrap(tags.toTagsArray()).each((element, index, array) => {
    // @ts-ignore
    cy.callFirestore('delete', `tags/${(element as Tag).id}`);
  });
}
