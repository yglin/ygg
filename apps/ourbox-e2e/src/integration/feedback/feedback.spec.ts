import {
  DebuggingPageObjectCypress,
  ErrorAlertPageObjectCypress,
  FooterPageObjectCypress
} from '@ygg/ourbox/test';
import { Feedback } from '@ygg/shared/post/core';
import {
  PostCreatePageObjectCypress,
  PostListPageObjectCypress,
  PostViewPageObjectCypress
} from '@ygg/shared/post/test';
import { myBeforeAll } from '../before-all';

describe('User can create feedbacks at some point', () => {
  const footerPO = new FooterPageObjectCypress();
  const debuggingPO = new DebuggingPageObjectCypress();
  const errorAlertPO = new ErrorAlertPageObjectCypress();
  const feedbackCreatePO = new PostCreatePageObjectCypress();
  const feedbackViewPO = new PostViewPageObjectCypress();
  const feedbackListPO = new PostListPageObjectCypress();

  const feedback = Feedback.forge();

  before(() => {
    myBeforeAll();
    cy.visit('/');
  });

  it('Can create feedback over error alert dialog', () => {
    footerPO.gotoDebuggingPage();
    debuggingPO.showErrorAlert();
    errorAlertPO.expectVisible();
    errorAlertPO.gotoFeedbackCreate();
    feedbackCreatePO.expectVisible();
    feedbackCreatePO.setValue(feedback);
    feedbackCreatePO.submit();
    feedbackViewPO.expectVisible();
    feedbackViewPO.expectValue(feedback);
    footerPO.gotoFeedbackListPage();
    feedbackListPO.expectTopPost(feedback);
  });
});
