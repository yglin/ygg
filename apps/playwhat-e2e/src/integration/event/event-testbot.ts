import { ImitationEvent } from '@ygg/playwhat/core';
import { MyCalendarPageObjectCypress, SiteNavigator } from '@ygg/playwhat/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { loginTestUser } from '@ygg/shared/user/test';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObjectCypress, TheThingPageObjectCypress } from '@ygg/the-thing/test';

const siteNavigator = new SiteNavigator();
const eventPO = new TheThingPageObjectCypress('', ImitationEvent);
const myCalendarPO = new MyCalendarPageObjectCypress();
const emceePO = new EmceePageObjectCypress();
const myHostEventsDataTablePO = new TheThingDataTablePageObjectCypress(
  '',
  ImitationEvent
);

export function hostApproveEvent(host: User, organizer: User, event: TheThing) {
  loginTestUser(host);
  siteNavigator.goto(
    [ImitationEvent.routePath, 'my'],
    myHostEventsDataTablePO
  );
  myHostEventsDataTablePO.gotoTheThingView(event);
  eventPO.expectVisible();
  eventPO.expectName(event.name);
  eventPO.expectState(ImitationEvent.states['wait-approval']);
  eventPO.runAction(ImitationEvent.actions['host-approve']);
  emceePO.confirm(`確定會以負責人身份出席參加行程${event.name}？`);
  emceePO.alert(`已確認參加，之後若要取消請聯絡主辦者${organizer.name}`);
  myCalendarPO.expectVisible();
  myCalendarPO.expectEvent(event);
}