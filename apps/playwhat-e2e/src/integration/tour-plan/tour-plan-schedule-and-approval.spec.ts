import * as env from '@ygg/env/environments.json';
import {
  ImitationEvent,
  ImitationEventCellDefines,
  ImitationTourPlan,
  ImitationTourPlanCellDefines,
  RelationshipScheduleEvent
} from '@ygg/playwhat/core';
import {
  MyCalendarPageObjectCypress,
  SiteNavigator,
  TourPlanPageObjectCypress
} from '@ygg/playwhat/test';
import { SchedulePageObjectCypress } from '@ygg/schedule/test';
import { TimeRange, DateRange } from '@ygg/shared/omni-types/core';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { waitForLogin } from '@ygg/shared/user/test';
import { RelationPurchase } from '@ygg/shopping/core';
import { TheThing } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingPageObjectCypress,
  TheThingDataTablePageObjectCypress
} from '@ygg/the-thing/test';
import { find, isEmpty } from 'lodash';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import {
  ScheduledEvents,
  TourPlanScheduledOneEvent,
  TourPlanUnscheduledOnePlay
} from '../schedule/sample-schedules';

const mailSlurpInbox = env.mailslurp.inboxes[0];

describe('Approve scheduled events of tour-plan', () => {
  const siteNavigator = new SiteNavigator();
  ScheduledEvents.forEach(ev =>
    ImitationEvent.setState(ev, ImitationEvent.states.new)
  );
  const SampleThings = SamplePlays.concat(SampleEquipments).concat(
    TourPlanUnscheduledOnePlay
  );
  const tourPlanPO = new TourPlanPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  const eventPO = new TheThingPageObjectCypress('', ImitationEvent);
  const myCalendarPO = new MyCalendarPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const schedulePO = new SchedulePageObjectCypress('', {
    dateRange: TourPlanUnscheduledOnePlay.getCellValue(
      ImitationTourPlanCellDefines.dateRange.id
    ),
    dayTimeRange: TourPlanUnscheduledOnePlay.getCellValue(
      ImitationTourPlanCellDefines.dayTimeRange.id
    )
  });
  const myHostEventsDataTablePO = new TheThingDataTablePageObjectCypress(
    '',
    ImitationEvent
  );

  const testPlay: TheThing = find(SamplePlays, p =>
    TourPlanUnscheduledOnePlay.hasRelationTo(RelationPurchase.name, p.id)
  );
  const testEvent: TheThing = find(ScheduledEvents, ev =>
    TourPlanScheduledOneEvent.hasRelationTo(
      RelationshipScheduleEvent.name,
      ev.id
    )
  ).clone();
  let me: User;

  before(() => {
    // Only tour-plans of state applied can make schedule
    login().then(user => {
      me = user;
      // Only Admin user can make schedule
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        // thing.name += `_${Date.now()}`;
        thing.ownerId = user.id;
        theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
      });

      cy.visit('/');
      waitForLogin().then(() => {
        theMockDatabase.update(`${User.collection}/${user.id}`, {
          email: mailSlurpInbox.email
        });
        siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
        myTourPlansPO.theThingDataTablePO.gotoTheThingView(
          TourPlanUnscheduledOnePlay
        );
        tourPlanPO.expectVisible();
        tourPlanPO.theThingPO.expectName(TourPlanUnscheduledOnePlay.name);
      });
    });
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Schedule the tour-plan for one event', () => {
    tourPlanPO.theThingPO.runAction(ImitationTourPlan.actions['schedule']);
    schedulePO.expectVisible();
    // console.log(testEvent.getCellValue(ImitationEventCellDefines.timeRange.id));
    schedulePO.moveEvent(
      testPlay.name,
      (testEvent.getCellValue(
        ImitationEventCellDefines.timeRange.id
      ) as TimeRange).start
    );
    schedulePO.submit();
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectName(TourPlanUnscheduledOnePlay.name);
    tourPlanPO.expectEvents([testEvent]);
  });

  it('Send approval request for tour-plan', () => {
    tourPlanPO.theThingPO.runAction(
      ImitationTourPlan.actions['send-approval-requests']
    );
    emceePO.confirm(
      `將送出行程中各活動時段資訊給各活動負責人，並等待負責人確認。等待期間無法修改行程表，請確認行程中各活動時段已安排妥善，確定送出？`
    );
    emceePO.alert(`已送出行程確認，等待各活動負責人確認中`, { timeout: 60000 });
  });

  // it('Send approval request of scheduled event to owner of the play', () => {
  //   // cy.wait(10000);
  //   // @ts-ignore
  //   // cy.waitForLatestEmail(mailSlurpInbox.id).then(email => {
  //   cy.waitForMatchingEmail(mailSlurpInbox.id, testEvent.name).then(email => {
  //     expect(email.subject).to.have.string(
  //       `您有一項${testEvent.name}的行程活動邀請`
  //     );
  //     // console.log(email);
  //     // Extract link
  //     const regEx = new RegExp(
  //       `href="${env.siteConfig.url.protocol}://${env.siteConfig.url.domain}/(.*)"`
  //     );
  //     const links = regEx.exec(email.body);
  //     if (isEmpty(links) || links.length < 2) {
  //       throw new Error(`Not found links in email body:\n${email.body}`);
  //     }
  //     const link = links[1];
  //     cy.visit(link);
  //     waitForLogin();
  //     emceePO.confirm(
  //       `確認以負責人身份參加行程${testEvent.name}？請於行程活動頁面按下確認參加按鈕`
  //     );
  //     eventPO.expectVisible();
  //     eventPO.expectState(ImitationEvent.states['wait-approval']);
  //     eventPO.runAction(ImitationEvent.actions['host-approve']);
  //     emceePO.confirm(`確定會以負責人身份出席參加行程${testEvent.name}？`);
  //     emceePO.alert(`已確認參加，之後若要取消請聯絡主辦者${me.name}`);
  //     myCalendarPO.expectVisible();
  //     myCalendarPO.expectEvent(testEvent);
  //   });
  // });

  // it('Click on event in calendar redirect to view page', () => {
  //   myCalendarPO.clickEvent(testEvent);
  //   eventPO.expectVisible();
  //   eventPO.expectValue(testEvent);
  //   eventPO.expectState(ImitationEvent.states['host-approved']);
  // });

  it('Add event to google calendar', () => {
    // ============= Comment out when above 2 tests enabled ==============
    siteNavigator.goto(
      [ImitationEvent.routePath, 'my'],
      myHostEventsDataTablePO
    );
    myHostEventsDataTablePO.gotoTheThingView(testEvent);
    eventPO.expectVisible();
    eventPO.expectState(ImitationEvent.states['wait-approval']);
    eventPO.runAction(ImitationEvent.actions['host-approve']);
    emceePO.confirm(`確定會以負責人身份出席參加行程${testEvent.name}？`);
    emceePO.alert(`已確認參加，之後若要取消請聯絡主辦者${me.name}`);
    myCalendarPO.expectVisible();
    myCalendarPO.expectEvent(testEvent);
    myCalendarPO.clickEvent(testEvent);
    eventPO.expectVisible();
    // ============= Comment out when above 2 tests enabled ==============
    // cy.pause();
    eventPO.expectActionButton(ImitationEvent.actions['add-google-calendar']);
    // eventPO.runAction(ImitationEvent.actions['add-google-calendar']);
    // emceePO.confirm(`將行程 ${testEvent.name} 加到我的Google日曆？`);
    // emceePO.alert(`行程 ${testEvent.name} 已加到你的Google日曆中`);
  });

  // it('Tour-plan approved when all its event approved', () => {
  //   siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
  //   myTourPlansPO.theThingDataTablePO.gotoTheThingView(
  //     TourPlanUnscheduledOnePlay
  //   );
  //   tourPlanPO.expectVisible();
  //   tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.approved);
  // });
});
