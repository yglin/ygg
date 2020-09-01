import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThingPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItemTransfer } from '@ygg/ourbox/core';
import { User } from '@ygg/shared/user/core';
import { UserThumbnailPageObjectCypress } from '@ygg/shared/user/test';
import { CommentListPageObjectCypress, ThreadPageObjectCypress } from '@ygg/shared/thread/test';

export class ItemTransferPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.item-transfer',
    giver: '.giver',
    receiver: '.receiver',
    thread: '.comment-thread'
  };

  theThingPO: TheThingPageObjectCypress;
  threadPO: ThreadPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingPO = new TheThingPageObjectCypress(
      this.getSelector(),
      ImitationItemTransfer
    );
    this.threadPO = new ThreadPageObjectCypress(this.getSelector('thread'));
  }

  expectReceiver(receiver: User) {
    const userThumbnailPO = new UserThumbnailPageObjectCypress(
      this.getSelector('receiver')
    );
    userThumbnailPO.expectUser(receiver);
  }

  expectGiver(giver: User) {
    const userThumbnailPO = new UserThumbnailPageObjectCypress(
      this.getSelector('giver')
    );
    userThumbnailPO.expectUser(giver);
  }
}
