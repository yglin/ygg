import {
  DebuggingPageObjectCypress,
  FooterPageObjectCypress
} from '@ygg/ourbox/test';
import { Feedback } from '@ygg/shared/post/core';
import {
  PostCreatePageObjectCypress,
  PostListPageObjectCypress,
  PostViewPageObjectCypress
} from '@ygg/shared/post/test';
import { logout, theMockDatabase } from '@ygg/shared/test/cypress';
import { YggDialogPageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { myBeforeAll } from '../before-all';

describe('User can create feedbacks at some point', () => {
  const footerPO = new FooterPageObjectCypress();
  const debuggingPO = new DebuggingPageObjectCypress();
  const feedbackCreatePO = new PostCreatePageObjectCypress();
  const feedbackViewPO = new PostViewPageObjectCypress();
  const feedbackListPO = new PostListPageObjectCypress();
  const dialogPO = new YggDialogPageObjectCypress();

  const feedback = Feedback.forge();

  const me = testUsers[0];

  before(() => {
    myBeforeAll();
    cy.visit('/');
    loginTestUser(me);
  });

  after(() => {
    logout();
    theMockDatabase.clear();
  });

  // it('Require login to create feedback', () => {
  // logout();
  // footerPO.gotoFeedbackListPage();
  // });

  it('Can create feedback over error alert dialog', () => {
    footerPO.gotoDebuggingPage();
    debuggingPO.showErrorAlert();
    dialogPO.expectVisible();
    dialogPO.gotoFeedbackCreate();
    feedbackCreatePO.expectVisible();
    feedbackCreatePO.expectTags(['feedback']);
    feedbackCreatePO.setValue(feedback);
    feedbackCreatePO.submit();
    feedbackViewPO.expectVisible();
    feedbackViewPO.expectValue(feedback);
    feedbackViewPO.expectAuthor(me);
    footerPO.gotoFeedbackListPage();
    feedbackListPO.expectTopPost(feedback);
  });
});
