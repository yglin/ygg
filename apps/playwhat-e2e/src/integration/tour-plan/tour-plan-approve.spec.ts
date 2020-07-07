import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
import { SamplePlays, SampleEquipments } from '../play/sample-plays';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingPageObjectCypress,
  TheThingDataTablePageObjectCypress
} from '@ygg/the-thing/test';
import { ImitationTourPlan, ImitationEvent } from '@ygg/playwhat/core';
import {
  TourPlanScheduled,
  ScheduledEvents,
  TourPlanScheduledOneEvent
} from '../schedule/sample-schedules';
import {
  login,
  theMockDatabase,
  getCurrentUser
} from '@ygg/shared/test/cypress';
import { waitForLogin } from '@ygg/shared/user/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';

describe('Approve scheduled events of tour-plan', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleEquipments)
    .concat(ScheduledEvents)
    .concat([TourPlanScheduledOneEvent]);
  const tourPlanPO = new TourPlanPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  const eventPO = new TheThingPageObjectCypress('', ImitationEvent);
  const emceePO = new EmceePageObjectCypress();

  before(() => {
    // Only tour-plans of state applied can make schedule
    login().then(user => {
      // Only Admin user can make schedule
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
      });
    });
  });

  beforeEach(() => {
    cy.visit('/');
    waitForLogin();
  });

  after(() => {
    // // Goto my-things page and delete previously created things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();
    theMockDatabase.clear();
  });

  it('Send approval request of each scheduled event to owner of the play', () => {
    const testEvent = ScheduledEvents[0];
    const serverId = 'wp2qzvrh'; // Replace SERVER_ID with an actual Mailosaur Server ID
    const testEmail = `${testEvent.id}.${serverId}@mailosaur.io`;
    getCurrentUser().then(user => {
      theMockDatabase.update(`users/${user.id}`, { email: testEmail });
    });
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanScheduledOneEvent
    );
    tourPlanPO.expectVisible();
    cy.pause();
    tourPlanPO.sendApprovalRequests();
    // @ts-ignore
    // cy.mailosaurGetMessage(serverId, {
    //   sendTo: testEmail
    // }).then(email => {
    //   cy.log(`HI~ MAMA!!!`);
    //   cy.wrap(email.subject).should('include.text', `您有待確認參加的活動`);
    // });
    cy.waitEmail({
      sentTo: testEmail
      // })
      // cy.request({
      //   method: 'POST',
      //   url: `https://mailosaur.com/api/messages/await?server=${serverId}`, // abcdefg is server name
      //   headers: {
      //     Authorization: `Basic ${btoa(Cypress.env('MAILOSAUR_API_KEY'))}`
      //   },
      //   body: {
      //     sentTo: testEmail
      //   }
    }).then(email => {
      cy.wrap(email)
        .its('subject')
        .should('include', '您有一項事件邀請');

      // console.log(response.body);
      cy.visit(email.html.links[0].href);
      waitForLogin();
      emceePO.confirm(
        `確認以負責人身份參加活動${testEvent.name}？請於活動事件頁面按下確認參加按鈕`
      );
      cy.location('pathname').should(
        'equal',
        `/${ImitationEvent.routePath}/${testEvent.id}`
      );
      eventPO.expectValue(testEvent);
      eventPO.expectState(ImitationEvent.states['wait-approval']);
    });

    // siteNavigator.goto(['events', 'my'], myEventsPO);
    // myEventsPO.expectVisible();
    // const eventsDataTablePO: TheThingDataTablePageObjectCypress = new TheThingDataTablePageObjectCypress(
    //   myEventsPO.getSelectorForDataTableByState(
    //     ImitationEvent.states['wait-approval']
    //   ),
    //   ImitationEvent
    // );
    // eventsDataTablePO.gotoTheThingView(testEvent);
    // eventPO.expectVisible();
    // eventPO.expectValue(testEvent);
    // eventPO.expectState(ImitationEvent.states['wait-approval']);
  });
});
