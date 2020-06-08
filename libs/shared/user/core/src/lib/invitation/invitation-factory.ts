import { generateID, DataAccessor, Emcee } from '@ygg/shared/infra/core';
import * as moment from 'moment';
import { config } from '../config';
import { cloneDeep } from 'lodash';
import { Authenticator } from '../authenticator';
import { UserAccessor } from '../user-accessor';
import { User } from '../user';
import { Subject } from 'rxjs';
import { InvitationAccessor } from './invitation-accessor';
import { Invitation } from '.';

export abstract class InvitationFactory {
  constructor(
    protected userAccessor: UserAccessor,
    protected dataAccessor: DataAccessor,
    protected authenticator: Authenticator,
    protected emcee: Emcee,
    protected invitationAccessor: InvitationAccessor
  ) {}

  confirm$: Subject<Invitation> = new Subject();

  async create(options: {
    type: string;
    inviterId: string;
    email: string;
    confirmMessage: string;
    data: any;
  }): Promise<Invitation> {
    const invitation: Invitation = {
      id: generateID(),
      type: options.type,
      inviterId: options.inviterId,
      email: options.email,
      confirmMessage: options.confirmMessage,
      expireDate: moment()
        .add(config.invitation.expireDays, 'days')
        .toDate(),
      data: options.data
    };
    await this.invitationAccessor.save(invitation);
    return invitation;
  }

  async confirm(id: string) {
    const invitation: Invitation = await this.invitationAccessor.load(id);
    const inviter: User = await this.userAccessor.get(invitation.inviterId);
    if (!inviter) {
      this.emcee.error(`找不到邀請者，id = ${invitation.inviterId}`);
      return;
    }

    const now = new Date();
    if (now > invitation.expireDate) {
      this.emcee.error(
        `抱歉，已超過邀請有效期限：${config.invitation.expireDays}天，請${inviter.name}再邀請一次`
      );
      return;
    }

    if (!this.authenticator.currentUser) {
      this.emcee.error(`您尚未註冊或登入`);
      return;
    }

    const confirm = await this.emcee.confirm(invitation.confirmMessage);
    if (confirm) {
      invitation.inviteeId = this.authenticator.currentUser.id;
      this.confirm$.next(invitation);
      this.dataAccessor.delete(config.invitation.collection, invitation.id);
    }
  }
}
