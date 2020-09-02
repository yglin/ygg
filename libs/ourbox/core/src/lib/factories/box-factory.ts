import { Emcee, Router, getEnv } from '@ygg/shared/infra/core';
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
  TheThingAccessor,
  TheThingFilter
} from '@ygg/the-thing/core';
import { UserAccessor } from 'libs/shared/user/core/src/lib/user-accessor';
import { flatten, get, isEmpty, uniq, uniqBy } from 'lodash';
import { combineLatest, Observable, of, Subscription, throwError } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  startWith,
  catchError,
  shareReplay,
  tap,
  finalize,
  take
} from 'rxjs/operators';
import {
  ImitationBox,
  ImitationBoxFlags,
  ImitationItem,
  ItemFilter,
  RelationshipBoxItem,
  RelationshipBoxMember,
  ImitationBoxThumbnailImages,
  ImitationBoxCells
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
  ObservableCaches: { [id: string]: Observable<any> } = {};

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
          // console.log('Confirm notification');
          // console.log(notification);
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
      const owner = await this.authenticator.requestLogin();
      let mailsMessage = '';
      if (!isEmpty(options.memberEmails)) {
        mailsMessage =
          '<h3>將會寄出加入邀請信給以下信箱</h3>' +
          options.memberEmails.map(email => '<h4>' + email + '</h4>').join('');
      }
      const confirmMessage = `<h2>確定要建立新的寶箱 ${options.name} ？<br>${mailsMessage}`;
      const confirm = await this.emcee.confirm(confirmMessage);
      if (!confirm) {
        return;
      }
      this.emcee.showProgress({ message: `建立新寶箱 ${options.name}` });
      const memberEmails = options.memberEmails || [];
      const isPublic = !!options.isPublic;
      const box = ImitationBox.createTheThing();
      box.ownerId = owner.id;
      box.name = options.name;
      box.image = !!options.image ? options.image : box.image;
      box.setFlag(ImitationBoxFlags.isPublic.id, isPublic);
      box.addUsersOfRole(RelationshipBoxMember.role, [owner.id]);
      // box.upsertCell(
      //   ImitationBoxCells.members.createCell(memberEmails.join(','))
      // );

      await this.theThingAccessor.upsert(box);
      mailsMessage = '';
      if (!isEmpty(memberEmails)) {
        for (const email of memberEmails) {
          await this.inviteBoxMember(box, email, owner);
        }
        mailsMessage = memberEmails
          .map(email => '<h4>' + email + '</h4>')
          .join('');
        mailsMessage = `<h3>已送出寶箱成員的邀請給以下email：</h3><br>${mailsMessage}`;
      }

      await this.emcee.info(
        `<h3>寶箱 ${box.name} 已建立</h3><br>${mailsMessage}`
      );
      this.router.navigate(['/', ImitationBox.routePath, box.id]);
      return box;
    } catch (error) {
      this.emcee.error(`開寶箱失敗，錯誤原因：${error.message}`);
    } finally {
      this.emcee.hideProgress();
    }
  }

  async inviteBoxMember(box: TheThing, email: string, inviter: User) {
    let invitee: User;
    try {
      invitee = await this.userAccessor.findByEmail(email);
    } catch (error) {
      invitee = null;
    }
    const mailSubject = `${getEnv('siteConfig.title')}：邀請您加入寶箱${
      box.name
    }`;
    const mailContent = `<pre><b>${inviter.name}</b>邀請您加入他的寶箱<b>${box.name}</b>，共享寶箱內的所有寶物</pre>`;
    const notification = await this.notificationFactory.create({
      type: NotificationJoinBox.type,
      inviterId: inviter.id,
      inviteeId: !!invitee ? invitee.id : '',
      email: email,
      mailSubject,
      mailContent,
      confirmMessage: `${this.authenticator.currentUser.name} 邀請您，是否要加入我們的寶箱：${box.name}？`,
      data: {
        boxId: box.id
      }
    });
  }

  async inviteBoxMembers(box: TheThing, emails: string[]) {
    try {
      const inviter = await this.authenticator.requestLogin();
      for (const email of emails) {
        await this.inviteBoxMember(box, email, inviter);
      }
    } catch (error) {
      this.emcee.error(`邀請寶箱成員失敗，錯誤原因：${error.message}`);
      return Promise.reject(error);
    }
  }

  async addBoxMember(boxId: string, userId: string) {
    try {
      const box = await this.theThingAccessor.load(
        boxId,
        ImitationBox.collection
      );
      box.addUsersOfRole(RelationshipBoxMember.role, [userId]);
      await this.theThingAccessor.update(box, 'users', box.users);
      return await this.relationFactory.waitRelation(
        boxId,
        userId,
        RelationshipBoxMember.role
      );
    } catch (error) {
      const wrapError = new Error(
        `Failed to add member "${userId}" to box "${boxId}".\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
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
    try {
      const inviteeId = get(notification, 'inviteeId', null);
      const invitee: User = await this.userAccessor.get(inviteeId);
      if (!invitee) {
        throw new Error(`找不到受邀加入的使用者，id = ${inviteeId}`);
      }
      const boxId = get(notification, 'data.boxId', null);
      const box: TheThing = await this.theThingAccessor.load(
        boxId,
        ImitationBox.collection
      );
      if (!box) {
        throw new Error(`找不到寶箱，id = ${boxId}`);
      }
      await this.addBoxMember(box.id, invitee.id);
      // console.log(`Box ${box.id} member ${invitee.id} added!!!`);
      this.router.navigate(['/', ImitationBox.routePath, box.id]);
    } catch (error) {
      this.emcee.error(`加入寶箱成員失敗：錯誤原因：${error.message}`);
      return Promise.reject(error);
    }
  }

  listItemIdsInBox$(boxId: string): Observable<string[]> {
    return this.relationFactory
      .findBySubjectAndRole$(boxId, RelationshipBoxItem.role)
      .pipe(
        // tap(relationRecords => console.log(relationRecords)),
        map(relationRecords => relationRecords.map(rr => rr.objectId))
      );
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
        // console.log(itemIds);
        // console.log(me);
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
      // tap(items => console.log(items))
    );
  }

  listMembers$(boxId: string): Observable<User[]> {
    return this.relationFactory
      .findBySubjectAndRole$(boxId, RelationshipBoxMember.role)
      .pipe(
        switchMap(relations => {
          if (isEmpty(relations)) {
            return of([]);
          } else {
            return this.userAccessor.listByIds$(relations.map(r => r.objectId));
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

  listMyBoxes$(): Observable<TheThing[]> {
    const cacheId = `listMyBoxes$`;
    if (!(cacheId in this.ObservableCaches)) {
      this.ObservableCaches[cacheId] = this.authenticator.currentUser$.pipe(
        switchMap(user => {
          if (!user) {
            return of([]);
          } else {
            return this.relationFactory.findByObjectAndRole$(
              user.id,
              RelationshipBoxMember.role
            );
          }
        }),
        // tap(relations => console.log(relations)),
        switchMap((relaitonRecords: RelationRecord[]) => {
          // console.log(relaitonRecords);
          return this.theThingAccessor.listByIds$(
            relaitonRecords.map(rr => rr.subjectId),
            ImitationBox.collection
          );
        }),
        catchError(error => {
          console.warn(error.message);
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.ObservableCaches[cacheId];
  }

  findItems$(itemFilter: ItemFilter): Observable<TheThing[]> {
    // itemFilter.addState(
    //   ImitationItem.stateName,
    //   ImitationItem.states.available.value
    // );
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

  /**
   * Find items available to me,
   * i.e. (1) in public box or my member box (2) in state available
   */
  listMyManifestItems$(): Observable<TheThing[]> {
    const itemFilter: TheThingFilter = ImitationItem.filter.clone();
    itemFilter.setState(
      ImitationItem.stateName,
      ImitationItem.states.available
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
        // console.log(itemIds);
        itemFilter.ids = uniq(flatten(itemIds));
        if (isEmpty(itemFilter.ids)) {
          return of([]);
        } else {
          return this.theThingAccessor.listByFilter$(
            itemFilter,
            ImitationItem.collection
          );
        }
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
