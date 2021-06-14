import {
  HtmlControlPageObjectCypress,
  TextControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { Post } from '@ygg/shared/post/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TagsControlPageObjectCypress } from '@ygg/shared/tags/test';

export class PostCreatePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.post-create',
    titleControl: '.title-control',
    contentControl: '.content-control',
    tagsControl: '.tags-control',
    buttonSubmit: 'button.submit'
  };

  titleControlPO: TextControlPageObjectCypress;
  contentEditorPO: HtmlControlPageObjectCypress;
  tagsControlPO: TagsControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.titleControlPO = new TextControlPageObjectCypress(
      this.getSelector('titleControl')
    );
    this.contentEditorPO = new HtmlControlPageObjectCypress(
      this.getSelector('contentControl')
    );
    this.tagsControlPO = new TagsControlPageObjectCypress(
      this.getSelector('tagsControl')
    );
  }

  setValue(post: Post): void {
    this.titleControlPO.setValue(post.title);
    this.contentEditorPO.setValue(post.content);
    this.tagsControlPO.setValue(post.tags);
  }

  expectTags(tags: string[]): void {
    this.tagsControlPO.expectTags(tags);
  }

  submit(): void {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
