import { Emcee, Router } from '@ygg/shared/infra/core';
import {
  Authenticator,
  config as UserConfig,
  Notification,
  NotificationFactory,
  User
} from '@ygg/shared/user/core';
import {
  RelationFactory,
  RelationRecord,
  TheThing,
  TheThingAccessor
} from '@ygg/the-thing/core';
import { UserAccessor } from 'libs/shared/user/core/src/lib/user-accessor';
import { flatten, get, isEmpty, uniq, uniqBy } from 'lodash';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { filter, map, switchMap, startWith } from 'rxjs/operators';
import {
  ImitationBox,
  ImitationBoxFlags,
  ImitationItem,
  ItemFilter,
  RelationshipBoxItem,
  RelationshipBoxMember,
  ImitationBoxThumbnailImages
} from '../models';
import { BoxCollection } from './box-accessor';
import { ItemAccessor } from './item-accessor';
import { ItemFactory } from './item-factory';

export const NotificationJoinBox = {
  type: 'join-box'
};

export class BoxFactory {
  // private authenticator: Authenticator;
  // private emcee: Emcee;
  // private notificationFactory: NotificationFactory;
  // private userAccessor: UserAccessor;
  // private theThingAccessor: TheThingAccessor;
  // private relationFactory: RelationFactory;

  subscriptions: Subscription[] = [];

  constructor(
    protected authenticator: Authenticator,
    protected emcee: Emcee,
    protected notificationFactory: NotificationFactory,
    protected userAccessor: UserAccessor,
    // protected boxAccessor: BoxAccessor,
    protected relationFactory: RelationFactory,
    protected router: Router,
    protected itemFactory: ItemFactory,
    protected itemAccessor: ItemAccessor,
    protected theThingAccessor: TheThingAccessor
  ) {
    this.subscriptions.push(
      this.notificationFactory.confirm$.subscribe(notification => {
        if (notification.type === NotificationJoinBox.type) {
          console.log('Confirm notification');
          console.log(notification);
          this.confirm(notification);
        }
      })
    );
  }

  async create(options: {
    name: string;
    image?: string;
    memberEmails?: string[];
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
      if (!isEmpty(options.memberEmails)) {
        mailsMessage =
          '<h3>將會寄出加入邀請信給以下信箱</h3>' +
          options.memberEmails.map(email => '<h4>' + email + '</h4>').join('');
      }
      const confirmMessage = `<h2>新增寶箱：${options.name}？<br>${mailsMessage}`;
      const confirm = await this.emcee.confirm(confirmMessage);
      if (!confirm) {
        return;
      }
      const memberEmails = options.memberEmails || [];
      const isPublic = !!options.isPublic;
      const box = ImitationBox.createTheThing();
      box.ownerId = this.authenticator.currentUser.id;
      box.name = options.name;
      box.image = options.image || ImitationBoxThumbnailImages[0];
      box.setFlag(ImitationBoxFlags.isPublic.id, isPublic);
      // box.upsertCell(
      //   ImitationBoxCells.members.createCell(memberEmails.join(','))
      // );

      await this.theThingAccessor.save(box);
      await this.addBoxMember(box.id, this.authenticator.currentUser.id);
      if (!isEmpty(memberEmails)) {
        await this.inviteBoxMembers(box, memberEmails);
      }

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
        const notification = await this.notificationFactory.create({
          type: NotificationJoinBox.type,
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

  async confirm(notification: Notification) {
    const inviteeId = get(notification, 'inviteeId', null);
    const invitee: User = await this.userAccessor.get(inviteeId);
    if (!invitee) {
      this.emcee.error(`找不到受邀加入的使用者，id = ${inviteeId}`);
      return;
    }
    const boxId = get(notification, 'data.boxId', null);
    const box: TheThing = await this.theThingAccessor.get(
      boxId,
      ImitationBox.collection
    );
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

  listItemIdsInBox$(boxId: string): Observable<string[]> {
    return this.relationFactory
      .findBySubjectAndRole$(boxId, RelationshipBoxItem.role)
      .pipe(map(relationRecords => relationRecords.map(rr => rr.objectId)));
  }

  listItemsAvailableInBox$(boxId: string): Observable<TheThing[]> {
    return this.listItemIdsInBox$(boxId).pipe(
      switchMap(itemIds => {
        if (isEmpty(itemIds)) {
          return of([]);
        } else {
          const itemsFilter = ImitationItem.filter.clone();
          itemsFilter.addState(
            ImitationItem.stateName,
            ImitationItem.states.available.value
          );
          itemsFilter.ids = itemIds;
          return this.theThingAccessor.listByFilter$(
            itemsFilter,
            ImitationItem.collection
          );
        }
      })
    );
  }

  listMyItemsEditingInBox$(boxId: string): Observable<TheThing[]> {
    const me$ = this.authenticator.currentUser$;
    return combineLatest([this.listItemIdsInBox$(boxId), me$]).pipe(
      switchMap(([itemIds, me]) => {
        if (!(me && me.id) || isEmpty(itemIds)) {
          return [];
        } else {
          const itemsFilter = ImitationItem.filter.clone();
          itemsFilter.addState(
            ImitationItem.stateName,
            ImitationItem.states.editing.value
          );
          itemsFilter.ids = itemIds;
          itemsFilter.ownerId = me.id;
          return this.theThingAccessor.listByFilter$(
            itemsFilter,
            ImitationItem.collection
          );
        }
      })
    );
  }

  async isMember(boxId: string, userId?: string): Promise<boolean> {
    if (!userId) {
      userId =
        this.authenticator.currentUser && this.authenticator.currentUser.id;
    }
    if (!userId) {
      return false;
    }
    return this.relationFactory.hasRelation(
      boxId,
      userId,
      RelationshipBoxMember.role
    );
  }

  listPublicBoxes$(): Observable<TheThing[]> {
    const publicBoxFilter = ImitationBox.filter;
    const flags = {};
    flags[ImitationBoxFlags.isPublic.id] = true;
    publicBoxFilter.addFlags(flags);
    return this.theThingAccessor.listByFilter$(
      publicBoxFilter,
      ImitationBox.collection
    );
  }

  listMyBoxes$(userId?: string): Observable<TheThing[]> {
    let userId$: Observable<string>;
    if (userId) {
      userId$ = of(userId);
    } else {
      userId$ = this.authenticator.currentUser$.pipe(
        filter(user => !!user),
        map(user => user.id)
      );
    }
    return userId$.pipe(
      switchMap(_userId => {
        // console.log(_userId);
        return this.relationFactory.findByObjectAndRole$(
          _userId,
          RelationshipBoxMember.role
        );
      }),
      switchMap((relaitonRecords: RelationRecord[]) => {
        // console.log(relaitonRecords);
        return this.theThingAccessor.listByIds$(
          relaitonRecords.map(rr => rr.subjectId),
          ImitationBox.collection
        );
      })
    );
  }

  findItems$(itemFilter: ItemFilter): Observable<TheThing[]> {
    itemFilter.addState(
      ImitationItem.stateName,
      ImitationItem.states.available.value
    );
    return combineLatest([
      this.listMyBoxes$().pipe(startWith([])),
      this.listPublicBoxes$()
    ]).pipe(
      map(([myBoxes, publicBoxes]) => {
        // console.log(myBoxes);
        // console.log(publicBoxes);
        return uniqBy(myBoxes.concat(publicBoxes), 'id');
      }),
      switchMap(boxes => {
        if (isEmpty(boxes)) {
          return of([]);
        } else {
          const observableItemIds: Observable<string[]>[] = [];
          for (const box of boxes) {
            observableItemIds.push(this.listItemIdsInBox$(box.id));
          }
          return combineLatest(observableItemIds);
        }
      }),
      switchMap((itemIds: string[][]) => {
        itemFilter.ids = uniq(flatten(itemIds));
        return this.theThingAccessor.listByFilter$(
          itemFilter,
          ImitationItem.collection
        );
      })
    );
  }

  // async createNotification(box: TheThing, mail: string): Promise<string> {
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
