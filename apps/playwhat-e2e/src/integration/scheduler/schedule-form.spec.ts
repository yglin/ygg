import { last } from 'lodash';
import { login } from '../../page-objects/app.po';
import { SiteNavigator } from '../../page-objects/site-navigator';
import {
  ScheduleFormPageObjectCypress,
  ScheduleFormViewPageObjectCypress,
  ScheduleFormListPageObjectCypress,
  deleteScheduleForm
} from '../../page-objects/scheduler';
import {
  ScheduleForm,
  ScheduleFormViewPagePageObject
} from '@ygg/playwhat/scheduler';
import { ScheduleFormViewPagePageObjectCypress } from '../../page-objects/scheduler/schedule-form-view-page.po';
import { Tags } from '@ygg/tags/core';
import { deleteTags } from "../../page-objects/tags";

describe('Scheduler - schedule-form', () => {
  const siteNavigator = new SiteNavigator();
  const scheduleFormPageObject: ScheduleFormPageObjectCypress = new ScheduleFormPageObjectCypress(
    ''
  );
  const scheduleFormViewPageObject: ScheduleFormViewPageObjectCypress = new ScheduleFormViewPageObjectCypress(
    ''
  );
  const scheduleFormViewPagePageObject: ScheduleFormViewPagePageObject = new ScheduleFormViewPagePageObjectCypress(
    ''
  );

  beforeEach(function() {
    cy.visit('/');
    login();
  });

  // it('Should submit consistent data', () => {
  //   siteNavigator.goto(['scheduler', 'new']);
  //   const testScheduleForm = ScheduleForm.forge();
  //   scheduleFormPageObject.setValue(testScheduleForm);
  //   scheduleFormPageObject.submit();
  //   cy.url().should('not.match', /.*scheduler\/new.*/);
  //   scheduleFormViewPageObject.expectValue(testScheduleForm);
  //   cy.location('pathname').then((loc: any) => {
  //     const pathname: string = loc as string;
  //     const id = last(pathname.split('/'));
  //     if (id) {
  //       testScheduleForm.id = id;
  //       deleteScheduleForm(testScheduleForm);
  //     }
  //   });
  // });

  it('should be able to find and edit, update schedule-form', () => {
    // Goto scheduler/new page, create testScheduleForm
    siteNavigator.goto(['scheduler', 'new']);
    const testScheduleForm = ScheduleForm.forge();
    cy.log('##### Create new schedule form #####');
    scheduleFormPageObject.setValue(testScheduleForm);
    scheduleFormPageObject.submit();
    cy.url().should('not.match', /.*scheduler\/new.*/);
    cy.location('pathname').then((loc: any) => {
      const pathname: string = loc as string;
      const id = last(pathname.split('/'));
      cy.wrap(id).as('newScheduleFormId');
    });
    cy.get<string>('@newScheduleFormId').then(newScheduleFormId => {
      cy.log(`##### Got new schedule form, id = ${newScheduleFormId} #####`);
      testScheduleForm.id = newScheduleFormId;

      // Goto my-schedules page, find the testScheduleForm and check it out
      siteNavigator.goto(['scheduler', 'my', 'forms']);
      cy.log(`##### Find new schedule form in my schedule-forms #####`);
      const myScheduleFormsPageObject = new ScheduleFormListPageObjectCypress();
      myScheduleFormsPageObject.expectScheduleForm(testScheduleForm);
      myScheduleFormsPageObject.viewScheduleForm(testScheduleForm);

      // In view page of testScheduleForm, click edit button and goto edit page
      cy.location('pathname').should('include', testScheduleForm.id);
      cy.log(`##### Found new schedule form, go to its edit page #####`);
      scheduleFormViewPagePageObject.gotoEdit();

      // In edit page of testScheduleForm, change data and submit
      // The edit page is exactly the same as scheduler/new page,
      // so we can reuse the same page object
      cy.location('pathname').should('include', `${testScheduleForm.id}/edit`);
      const changedScheduleForm = ScheduleForm.forge();
      cy.log(`##### Edit new schedule form, fill in different data #####`);
      scheduleFormPageObject.setValue(changedScheduleForm);
      scheduleFormPageObject.submit();

      // // Being redirected to view page again,
      // // but this time we assert data with changedchangedScheduleForm
      cy.location('pathname').should('include', testScheduleForm.id);
      cy.log(`##### New schedule form updated, check if data is updated #####`);
      scheduleFormViewPageObject.expectValue(changedScheduleForm);

      cy.log(`##### All done, clean temporary test data #####`);
      const allTags: Tags = testScheduleForm.tags.merge(changedScheduleForm.tags);
      deleteScheduleForm(testScheduleForm);
      deleteTags(allTags);
    });
  });
});
