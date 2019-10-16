import { last } from "lodash";
import { login } from "../../page-objects/app.po";
import { SiteNavigator } from '../../page-objects/site-navigator';
import { ScheduleFormPageObjectCypress, ScheduleFormViewPageObjectCypress, deleteScheduleForm } from "../../page-objects/scheduler";
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
    cy.url().should('not.match', /.*scheduler\/new.*/);
    scheduleFormViewPageObject.expectValue(scheduleForm);
    cy.location('pathname').then((loc: any) => {
      const pathname: string = loc as string;
      const id = last(pathname.split('/'));
      if (id) {
        scheduleForm.id = id;
        deleteScheduleForm(scheduleForm);
      }
    });
  });

});
