import { login } from "../../page-objects/app.po";
import { SiteNavigator } from '../../page-objects/site-navigator';
import { ScheduleFormPageObjectCypress, ScheduleFormViewPageObjectCypress } from "../../page-objects/scheduler";
import { ScheduleForm } from '@ygg/playwhat/scheduler';

describe('Scheduler', () => {
  const siteNavigator = new SiteNavigator();
  const scheduleFormPageObject: ScheduleFormPageObjectCypress = new ScheduleFormPageObjectCypress('');
  const scheduleFormViewPageObject: ScheduleFormViewPageObjectCypress = new ScheduleFormViewPageObjectCypress('');

  beforeEach(function() {
    cy.visit('/');
    login();
    siteNavigator.goto(['scheduler', 'new']);
  });
  
  it('Should submit consistent data', () => {
    const scheduleForm = ScheduleForm.forge();
    scheduleFormPageObject.setValue(scheduleForm);
    scheduleFormPageObject.submit();
    scheduleFormViewPageObject.expectValue(scheduleForm);
  });

});
