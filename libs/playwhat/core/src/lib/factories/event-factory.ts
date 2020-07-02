import {
  TheThing,
  TheThingAccessor,
  RelationFactory
} from '@ygg/the-thing/core';
import {
  User,
  UserAccessor,
  InvitationFactory,
  Authenticator
} from '@ygg/shared/user/core';
import { RelationshipPlay, ImitationEvent } from '../imitations';
import { EmceeService } from '@ygg/shared/ui/widgets';

export const InvitationHostEvent = {
  type: 'host-event'
};

export class EventFactory {
  constructor(
    protected theThingAccessor: TheThingAccessor,
    protected userAccessor: UserAccessor,
    protected invitationFactory: InvitationFactory,
    protected authenticator: Authenticator,
    protected emcee: EmceeService
  ) {}

  async sendApprovalRequest(event: TheThing) {
    ImitationEvent.setState(event, ImitationEvent.states['wait-approval']);
    await this.theThingAccessor.save(event);
    
    const serviceId = event.getRelationObjectIds(RelationshipPlay.name)[0];
    const service: TheThing = await this.theThingAccessor.get(serviceId);
    const host = await this.userAccessor.get(service.ownerId);
    const mailSubject = `${location.hostname}：您有一項事件邀請`;
    const mailContent = `<pre>您有一項事件邀請，以活動<b>${event.name}</b>的負責人身分參加</pre>`;
    await this.invitationFactory.create({
      type: InvitationHostEvent.type,
      inviterId: this.authenticator.currentUser.id,
      email: host.email,
      mailSubject,
      mailContent,
      confirmMessage: `<h3>確認以負責人身份參加活動${event.name}？</h3><div>請於活動事件頁面按下確認參加按鈕</div>`,
      landingUrl: `/${ImitationEvent.routePath}/${event.id}`,
      data: {}
    });
  }
}
