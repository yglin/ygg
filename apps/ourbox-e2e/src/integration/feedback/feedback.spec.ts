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
import {
  EmceePageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import {
  LoginDialogPageObjectCypress,
  loginTestUser,
  testUsers
} from '@ygg/shared/user/test';
import { myBeforeAll } from '../before-all';

describe('User can create feedbacks at some point', () => {
  const footerPO = new FooterPageObjectCypress();
  const debuggingPO = new DebuggingPageObjectCypress();
  const feedbackCreatePO = new PostCreatePageObjectCypress();
  const feedbackViewPO = new PostViewPageObjectCypress();
  const feedbackListPO = new PostListPageObjectCypress();
  const dialogPO = new YggDialogPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const loginDialogPO = new LoginDialogPageObjectCypress();

  const feedback01 = Feedback.forge();
  const feedback02 = Feedback.forge();

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

  it('Can create feedback over error alert dialog', () => {
    footerPO.gotoDebuggingPage();
    debuggingPO.showErrorAlert();
    dialogPO.expectVisible();
    dialogPO.gotoFeedbackCreate();
    feedbackCreatePO.expectVisible();
    feedbackCreatePO.expectTags(['feedback']);
    feedbackCreatePO.setValue(feedback01);
    feedbackCreatePO.submit();
    feedbackViewPO.expectVisible();
    feedbackViewPO.expectValue(feedback01);
    feedbackViewPO.expectAuthor(me);
    footerPO.gotoFeedbackListPage();
    feedbackListPO.expectTopPost(feedback01);
  });

  it('Require login to save feedback', () => {
    logout();
    cy.wait(1000);
    footerPO.gotoFeedbackListPage();
    feedbackListPO.expectVisible();
    feedbackListPO.gotoCreatePost();
    feedbackCreatePO.expectVisible();
    feedbackCreatePO.expectTags(['feedback']);
    feedbackCreatePO.setValue(feedback02);
    feedbackCreatePO.submit();
    emceePO.info(`請先登入才能發表文章`);
    loginDialogPO.expectVisible();
    const account = {
      email: me.email,
      password: me.password
    };
    loginDialogPO.loginTest(account);
    feedbackViewPO.expectVisible();
    feedbackViewPO.expectValue(feedback02);
    feedbackViewPO.expectAuthor(me);
    // Wait for the tags onCreate function do its job
    cy.wait(3000);
    footerPO.gotoFeedbackListPage();
    feedbackListPO.expectTopPost(feedback02);
  });
});
