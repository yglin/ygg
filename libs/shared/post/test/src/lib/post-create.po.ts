import { HtmlControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import { Post } from '@ygg/shared/post/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class PostCreatePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.post-create',
    contentControl: '.content-control',
    buttonSubmit: 'button.submit'
  };

  contentEditorPO: HtmlControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.contentEditorPO = new HtmlControlPageObjectCypress(
      this.getSelector('contentControl')
    );
  }

  setValue(post: Post): void {
    this.contentEditorPO.setValue(post.content);
  }

  submit(): void {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
