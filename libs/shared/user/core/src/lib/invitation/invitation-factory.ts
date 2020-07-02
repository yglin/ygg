import {
  DataAccessor,
  Dialog,
  Emcee,
  generateID,
  Router
} from '@ygg/shared/infra/core';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Invitation } from '.';
import { Authenticator } from '../authenticator';
import { config } from '../config';
import { User } from '../user';
import { UserAccessor } from '../user-accessor';
import { InvitationAccessor } from './invitation-accessor';

export abstract class InvitationFactory {
  constructor(
    protected userAccessor: UserAccessor,
    protected dataAccessor: DataAccessor,
    protected authenticator: Authenticator,
    protected emcee: Emcee,
    protected invitationAccessor: InvitationAccessor,
    protected dialog: Dialog,
    protected router: Router,
    protected mailListControlComponent: any
  ) {}

  confirm$: Subject<Invitation> = new Subject();

  async create(options: {
    type: string;
    inviterId: string;
    email: string;
    mailSubject?: string;
    mailContent: string;
    confirmMessage: string;
    landingUrl?: string;
    data: any;
  }): Promise<Invitation> {
    const id = generateID();
    const invitationLink = `${location.origin}/invite/${id}`;
    const mailSubject =
      options.mailSubject || `來自 ${location.hostname} 的邀請通知`;
    const mailContent = `
      <h3>來自 ${location.hostname} 的邀請，此為系統自動寄發，請勿回覆</h3>
      <br>
      ${options.mailContent}
      <br><br>
      <h3>點擊以下網址繼續：</h3>
      <br>
      <a href="${invitationLink}">${invitationLink}</a>
    `;
    const invitation: Invitation = {
      id,
      type: options.type,
      inviterId: options.inviterId,
      email: options.email,
      mailSubject,
      mailContent,
      confirmMessage: options.confirmMessage,
      landingUrl: options.landingUrl,
      expireDate: moment()
        .add(config.invitation.expireDays, 'days')
        .toDate(),
      data: options.data
    };
    await this.invitationAccessor.save(invitation);
    return invitation;
  }

  async confirm(id: string): Promise<Invitation> {
    try {
      if (!id) {
        throw new Error(`錯誤的id: ${id}`);
      }

      const invitation: Invitation = await this.invitationAccessor.load(id);
      if (!invitation) {
        throw new Error(`遺失邀請資料，id: ${id}`);
      }
      console.log(invitation);

      const inviter: User = await this.userAccessor.get(invitation.inviterId);
      if (!inviter) {
        throw new Error(`找不到邀請者，id: ${invitation.inviterId}`);
      }

      const now = new Date();
      if (now > invitation.expireDate) {
        throw new Error(
          `抱歉，已超過邀請有效期限：${config.invitation.expireDays}天，請${inviter.name}再邀請一次`
        );
      }

      const currentUser = await this.authenticator.requestLogin();

      const confirm = await this.emcee.confirm(invitation.confirmMessage);
      if (confirm) {
        invitation.inviteeId = currentUser.id;
        this.confirm$.next(invitation);
        // this.dataAccessor.delete(config.invitation.collection, invitation.id);
      }

      if (invitation.landingUrl) {
        this.router.navigateByUrl(invitation.landingUrl);
      }

      return invitation;
    } catch (error) {
      this.emcee.error(`確認邀請失敗，錯誤原因：${error.message}`);
      return null;
    }
  }

  async inquireEmails(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(this.mailListControlComponent, {
        title: '新增寶箱成員'
      });
      dialogRef.afterClosed().subscribe(
        emails => {
          if (!isEmpty(emails)) {
            resolve(emails);
          } else {
            resolve([]);
          }
        },
        error => reject(error)
      );
    });
  }
}
