import {
  TheThing,
  TheThingAccessor,
  RelationFactory
} from '@ygg/the-thing/core';
import {
  ImitationBox,
  ImitationBoxCells,
  ActivateTicket,
  RelationshipBoxMember
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
import { Subscription } from 'rxjs';
import { get } from 'lodash';
import { UserAccessor } from 'libs/shared/user/core/src/lib/user-accessor';
import { BoxAccessor, BoxCollection } from './box-accessor';

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
    protected router: Router
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
      const friendEmails = options.friendEmails || [];
      const isPublic = !!options.isPublic;
      const box = ImitationBox.createTheThing();
      box.ownerId = this.authenticator.currentUser.id;
      box.name = options.name;
      box.upsertCell(ImitationBoxCells.public.createCell(isPublic));
      box.upsertCell(
        ImitationBoxCells.friends.createCell(friendEmails.join(','))
      );

      await this.boxAccessor.save(box);

      await this.addBoxMember(box.id, this.authenticator.currentUser.id);

      for (const mail of friendEmails) {
        const invitation = await this.invitationFactory.create({
          type: InvitationJoinBox.type,
          inviterId: this.authenticator.currentUser.id,
          email: mail,
          confirmMessage: `來自 ${this.authenticator.currentUser.name} 的邀請，是否要加入我們的寶箱：${box.name}？`,
          data: {
            boxId: box.id
          }
        });
      }

      this.router.navigate(['/', 'ourbox', box.id]);
      return box;
    } catch (error) {
      this.emcee.error(`開寶箱失敗，錯誤原因：${error.message}`);
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
