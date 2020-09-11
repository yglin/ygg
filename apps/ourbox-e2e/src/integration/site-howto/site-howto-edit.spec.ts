import { SiteHowtoPageObjectCypress } from '@ygg/ourbox/test';
import { Html } from '@ygg/shared/omni-types/core';
import {
  loginAdmin,
  logout as logoutBackground,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, logout } from '@ygg/shared/user/test';
import { SiteNavigator } from '../../support/site-navigator';

describe('Edit site-howto page in place', () => {
  const siteNavigator = new SiteNavigator();
  const siteHowtoPO = new SiteHowtoPageObjectCypress();

  const regularUser = User.forge();
  const adminUser = User.forge();
  const users: User[] = [regularUser, adminUser];
  const testContent = `地球上提供給我們的物質財富足以滿足每個人的需求，但不足以滿足每個人的貪慾。原文網址：https://kknews.cc/essay/l88gynb.html`;
  const contentHtml = new Html(testContent);

  before(() => {
    theMockDatabase.insertUsers(users);
    theMockDatabase.setAdmins([adminUser.id]);
    logoutBackground().then(() => {
      cy.visit('/');
      siteNavigator.gotoSiteHowto();
    });
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Only admin user can edit site-howto page', () => {
    siteHowtoPO.expectVisible();
    siteHowtoPO.customPagePO.expectReadonly();
    loginTestUser(regularUser);
    siteHowtoPO.customPagePO.expectReadonly();
    logout();
    loginTestUser(adminUser);
    siteHowtoPO.customPagePO.expectEditable();
  });

  it('Open html editor', () => {
    siteHowtoPO.customPagePO.openEditor();
    siteHowtoPO.customPagePO.htmlEditorPO.expectVisible();
  });

  it('Show preview of edit', () => {
    siteHowtoPO.customPagePO.htmlEditorPO.setValue(contentHtml);
    cy.wait(1000);
    siteHowtoPO.customPagePO.switchToPreview();
    siteHowtoPO.customPagePO.expectPreview(contentHtml);
  });

  it('Save and expect the edit persistent', () => {
    siteHowtoPO.customPagePO.save();
    siteHowtoPO.customPagePO.expectTabsHeaderHidden();
    siteHowtoPO.customPagePO.expectPreview(contentHtml);
    siteNavigator.gotoHome();
    siteNavigator.gotoSiteHowto();
    siteHowtoPO.expectVisible();
    siteHowtoPO.customPagePO.expectPreview(contentHtml);
  });

  it('Cancel and discard edit', () => {
    const contentHtml2Cancel = new Html(`一朝被蛇咬，處處聞啼鳥`);
    siteHowtoPO.customPagePO.openEditor();
    siteHowtoPO.customPagePO.htmlEditorPO.setValue(contentHtml2Cancel);
    siteHowtoPO.customPagePO.switchToPreview();
    siteHowtoPO.customPagePO.expectPreview(contentHtml2Cancel);
    siteHowtoPO.customPagePO.cancel();
    siteHowtoPO.customPagePO.expectTabsHeaderHidden();
    siteHowtoPO.customPagePO.expectPreview(contentHtml);
    siteNavigator.gotoHome();
    siteNavigator.gotoSiteHowto();
    siteHowtoPO.expectVisible();
    siteHowtoPO.customPagePO.expectPreview(contentHtml);
  });
});
