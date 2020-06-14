import {
  TheThing,
  TheThingAccessor,
  RelationFactory
} from '@ygg/the-thing/core';
import {
  ImitationBox,
  ImitationBoxCells,
  ActivateTicket,
  RelationshipBoxMember,
  ImitationItem,
  RelationshipBoxItem,
  ImitationBoxFlags
} from '../models';
import { Emcee, DataAccessor, Router } from '@ygg/shared/infra/core';
import { URL } from 'url';
import {
  InvitationFactory,
  Authenticator,
  Invitation,
  User,
  config as UserConfig
} from '@ygg/shared/user/core';
import { Subscription, Observable } from 'rxjs';
import { get, isEmpty, tap } from 'lodash';
import { UserAccessor } from 'libs/shared/user/core/src/lib/user-accessor';
import { BoxAccessor, BoxCollection } from './box-accessor';
import { ItemFactory } from './item-factory';
import { switchMap } from 'rxjs/operators';
import { ItemAccessor } from './item-accessor';

export const InvitationJoinBox = {
  type: 'join-box'
};

export class BoxFactory {
  // private authenticator: Authenticator;
  // private emcee: Emcee;
  // private invitationFactory: InvitationFactory;
  // private userAccessor: UserAccessor;
  // private theThingAccessor: TheThingAccessor;
  // private relationFactory: RelationFactory;

  subscriptions: Subscription[] = [];

  constructor(
    protected authenticator: Authenticator,
    protected emcee: Emcee,
    protected invitationFactory: InvitationFactory,
    protected userAccessor: UserAccessor,
    protected boxAccessor: BoxAccessor,
    protected relationFactory: RelationFactory,
    protected router: Router,
    protected itemFactory: ItemFactory,
    protected itemAccessor: ItemAccessor
  ) {
    this.subscriptions.push(
      this.invitationFactory.confirm$.subscribe(invitation => {
        if (invitation.type === InvitationJoinBox.type) {
          this.confirm(invitation);
        }
      })
    );
  }

  async create(options: {
    name: string;
    friendEmails?: string[];
    isPublic?: boolean;
  }): Promise<TheThing> {
    try {
      this.authenticator.requestLogin();
    } catch (error) {
      this.emcee.warning(`必須先登入才能繼續`);
      return;
    }
    try {
      let mailsMessage = '';
      if (!isEmpty(options.friendEmails)) {
        mailsMessage =
          '<h3>將會寄出加入邀請信給以下信箱</h3>' +
          options.friendEmails.map(email => '<h4>' + email + '</h4>').join('');
      }
      const confirmMessage = `<h2>新增寶箱：${options.name}？<br>${mailsMessage}`;
      const confirm = await this.emcee.confirm(confirmMessage);
      if (!confirm) {
        return;
      }
      const friendEmails = options.friendEmails || [];
      const isPublic = !!options.isPublic;
      const box = ImitationBox.createTheThing();
      box.ownerId = this.authenticator.currentUser.id;
      box.name = options.name;
      box.setFlag(ImitationBoxFlags.isPublic.id, isPublic);
      // box.upsertCell(
      //   ImitationBoxCells.friends.createCell(friendEmails.join(','))
      // );

      await this.boxAccessor.save(box);
      await this.addBoxMember(box.id, this.authenticator.currentUser.id);
      await this.inviteBoxMembers(box, friendEmails);

      this.router.navigate(['/', 'ourbox', box.id]);
      return box;
    } catch (error) {
      this.emcee.error(`開寶箱失敗，錯誤原因：${error.message}`);
    }
  }

  async inviteBoxMembers(box: TheThing, emails: string[]) {
    try {
      const mailSubject = `${location.hostname}：邀請您加入寶箱${box.name}`;
      const mailContent = `<pre><b>${this.authenticator.currentUser.name}</b>邀請您加入他的寶箱<b>${box.name}</b>，共享寶箱內的所有寶物</pre>`;
      for (const mail of emails) {
        const invitation = await this.invitationFactory.create({
          type: InvitationJoinBox.type,
          inviterId: this.authenticator.currentUser.id,
          email: mail,
          mailSubject,
          mailContent,
          confirmMessage: `${this.authenticator.currentUser.name} 邀請您，是否要加入我們的寶箱：${box.name}？`,
          landingUrl: `/${ImitationBox.routePath}/${box.id}`,
          data: {
            boxId: box.id
          }
        });
      }
      const mailsMessage = emails
        .map(email => '<h4>' + email + '</h4>')
        .join('');
      this.emcee.info(
        `<h3>已送出寶箱成員的邀請給以下email：</h3><br>${mailsMessage}`
      );
    } catch (error) {
      this.emcee.error(`邀請寶箱成員失敗，錯誤原因：${error.message}`);
    }
  }

  async addBoxMember(boxId: string, userId: string) {
    return this.relationFactory.create({
      subjectCollection: BoxCollection,
      subjectId: boxId,
      objectCollection: UserConfig.user.collection,
      objectId: userId,
      objectRole: RelationshipBoxMember.role
    });
  }

  async createItem(
    boxId: string,
    options: {
      backUrl?: string;
    } = {}
  ) {
    const item = await this.itemFactory.create();
    if (item) {
      try {
        this.relationFactory.create({
          subjectCollection: BoxCollection,
          subjectId: boxId,
          objectCollection: ImitationItem.collection,
          objectId: item.id,
          objectRole: RelationshipBoxItem.role
        });
        if (options.backUrl) {
          this.router.navigateByUrl(options.backUrl);
        }
      } catch (error) {
        this.emcee.error(
          `建立寶箱${boxId}與寶物${item.id}關係失敗，錯誤原因：${error.message}`
        );
      }
    }
  }

  async confirm(invitation: Invitation) {
    const inviteeId = get(invitation, 'inviteeId', null);
    const invitee: User = await this.userAccessor.get(inviteeId);
    if (!invitee) {
      this.emcee.error(`找不到受邀加入的使用者，id = ${inviteeId}`);
      return;
    }
    const boxId = get(invitation, 'data.boxId', null);
    const box: TheThing = await this.boxAccessor.load(boxId);
    if (!box) {
      this.emcee.error(`找不到寶箱，id = ${boxId}`);
      return;
    }
    try {
      await this.addBoxMember(box.id, invitee.id);
    } catch (error) {
      this.emcee.error(`加入寶箱失敗：錯誤原因：${error.message}`);
    }
  }

  listItemsInBox$(boxId: string): Observable<TheThing[]> {
    return this.relationFactory
      .findBySubjectAndRole$(boxId, RelationshipBoxItem.role)
      .pipe(
        switchMap(relationRecords =>
          this.itemAccessor.listByIds$(relationRecords.map(rr => rr.objectId))
        )
      );
  }

  // async createInvitation(box: TheThing, mail: string): Promise<string> {
  //   const activateTicket: ActivateTicket = await this.createActivateTicket(
  //     box,
  //     mail
  //   );
  //   return `${activateTicket.createLink()}`;
  // }

  // async createActivateTicket(
  //   box: TheThing,
  //   mail: string
  // ): Promise<ActivateTicket> {
  //   const ticket = new ActivateTicket({
  //     mail,
  //     subjectCollection: TheThing.collection,
  //     subjectId: box.id
  //   });

  //   await this.dataAccessor.upsert(ActivateTicket.collection, ticket.toJSON());
  //   return ticket;
  // }
}
