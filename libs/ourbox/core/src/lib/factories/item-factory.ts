import {
  TheThing,
  TheThingFactory,
  RelationFactory,
  Relationship,
  RelationRecord,
  TheThingAccessor,
  RelationAccessor
} from '@ygg/the-thing/core';
import { Router, Emcee } from '@ygg/shared/infra/core';
import {
  Subject,
  BehaviorSubject,
  Observable,
  of,
  Subscription,
  throwError
} from 'rxjs';
import {
  ImitationItem,
  // ItemFilter,
  RelationshipBoxItem,
  RelationshipItemHolder,
  RelationshipItemRequester,
  ImitationItemCells,
  ImitationItemStates
} from '../models';
import { take, filter, switchMap, tap, catchError, map } from 'rxjs/operators';
import { ItemAccessor } from './item-accessor';
import { User, UserAccessor, Authenticator } from '@ygg/shared/user/core';
import { isEmpty, first } from 'lodash';
import { Location } from '@ygg/shared/omni-types/core';

export class ItemFactory {
  // creatingPool: {
  //   [id: string]: {
  //     local$: BehaviorSubject<TheThing>;
  //     // onSave$: Subject<TheThing>;
  //   };
  // } = {};

  subscription: Subscription = new Subscription();

  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected authenticator: Authenticator,
    // protected itemAccessor: ItemAccessor,
    protected theThingFactory: TheThingFactory,
    protected relationFactory: RelationFactory,
    protected userAccessor: UserAccessor,
    protected theThingAccessor: TheThingAccessor
  ) {
    this.subscription.add(
      this.theThingFactory.runAction$.subscribe(actionInfo => {
        switch (actionInfo.action.id) {
          case ImitationItem.actions['publish-available'].id:
            this.publishAvailable(actionInfo.theThing);
            break;

          case ImitationItem.actions['request'].id:
            this.requestBorrowItem(actionInfo.theThing.id);
            break;

          case ImitationItem.actions['cancel-request'].id:
            this.cancelRequest(actionInfo.theThing.id);
            break;

          default:
            break;
        }
      })
    );
  }

  async create(): Promise<TheThing> {
    try {
      const user = await this.authenticator.requestLogin();
      const newItem = await this.theThingFactory.create({
        imitation: ImitationItem
      });
      newItem.setUserOfRole(RelationshipItemHolder.role, user.id);
      this.router.navigate([ImitationItem.routePath, newItem.id]);
      return this.theThingFactory.onSave$
        .pipe(
          filter(thing => thing.id === newItem.id),
          take(1)
        )
        .toPromise()
        .then(async (resultItem: TheThing) => {
          const confirm = await this.emcee.confirm(
            `<h3>順便開放寶物 ${resultItem.name} 讓人索取嗎？<h3><h3>開放後資料無法修改喔</h3>`
          );
          if (confirm) {
            await this.theThingFactory.setState(
              resultItem,
              ImitationItem,
              ImitationItem.states.available,
              { force: true }
            );
          }
          return resultItem;
        });
    } catch (error) {
      this.emcee.error(`新增寶物失敗，錯誤原因：${error.message}`);
      return;
    }
  }

  async load(id: string): Promise<Observable<TheThing>> {
    return this.theThingFactory.load$(id, ImitationItem.collection);
  }

  async publishAvailable(item: TheThing) {
    try {
      const confirm = await this.emcee.confirm(
        `<h3>開放寶物 ${item.name} 讓人索取嗎？<h3><h3>開放後資料便無法修改喔</h3>`
      );
      if (confirm) {
        await this.theThingFactory.setState(
          item,
          ImitationItem,
          ImitationItem.states.available,
          { force: true }
        );
        await this.emcee.info(`<h3>寶物 ${item.name} 已開放讓人索取</h3>`);
      }
    } catch (error) {
      this.emcee.error(`開放寶物索取失敗，錯誤原因：${error.message}`);
    }
  }

  getItemHolder$(itemId: string): Observable<User> {
    return this.relationFactory
      .findBySubjectAndRole$(itemId, RelationshipItemHolder.role)
      .pipe(
        // tap(relations => console.log(relations)),
        filter(relations => !isEmpty(relations)),
        switchMap((relations: RelationRecord[]) => {
          return this.userAccessor.get$(relations[0].objectId);
        })
      );
  }

  isItemHolder$(itemId: string, userId?: string): Observable<boolean> {
    let userId$: Observable<string>;
    if (userId) {
      userId$ = of(userId);
    } else {
      userId$ = this.authenticator.currentUser$.pipe(
        map(user => (!!user ? user.id : null))
      );
    }
    return userId$.pipe(
      switchMap(_userId => {
        if (_userId) {
          return this.relationFactory.hasRelation$(
            itemId,
            _userId,
            RelationshipItemHolder.role
          );
        } else {
          return of(false);
        }
      })
    );
  }

  hasRequestedBorrowItem$(
    itemId: string,
    userId?: string
  ): Observable<boolean> {
    let userId$: Observable<string>;
    if (userId) {
      userId$ = of(userId);
    } else {
      userId$ = this.authenticator.currentUser$.pipe(
        map(user => (!!user ? user.id : null))
      );
    }
    return userId$.pipe(
      switchMap(_userId => {
        if (!!_userId) {
          return this.relationFactory.hasRelation(
            itemId,
            _userId,
            RelationshipItemRequester.role
          );
        } else {
          return of(false);
        }
      })
    );
  }

  async requestBorrowItem(itemId: string) {
    let item: TheThing;
    try {
      const user: User = await this.authenticator.requestLogin();
      item = await this.theThingFactory.load(itemId, ImitationItem.collection);
      const alreadyRequested = await this.hasRequestedBorrowItem$(item.id)
        .pipe(take(1))
        .toPromise();
      if (alreadyRequested) {
        this.emcee.warning(`你已經請求索取 ${item.name} 並且正在排隊等候中`);
        return;
      }
      const IamHolder = await this.isItemHolder$(item.id)
        .pipe(take(1))
        .toPromise();
      if (IamHolder) {
        this.emcee.warning(`你是 ${item.name} 目前的保管者內...`);
        return;
      }
      const confirm = await this.emcee.confirm(
        `送出索取 ${item.name} 的請求，並且排隊等待？`
      );
      if (confirm) {
        item.addUsersOfRole(RelationshipItemRequester.role, [user.id]);
        await this.theThingAccessor.update(item, 'users', item.users);
        this.emcee.info(`已送出索取 ${item.name} 的請求`);
      }
    } catch (error) {
      this.emcee.error(
        `索取 ${itemId} ${item ? item.name : ''} 失敗，錯誤原因：${
          error.message
        }`
      );
    }
  }

  getItemRequestBorrowers$(itemId: string): Observable<User[]> {
    return this.relationFactory
      .findBySubjectAndRole$(itemId, RelationshipItemRequester.role)
      .pipe(
        switchMap((relations: RelationRecord[]) => {
          // Ordered by createAt
          relations.sort((ra, rb) => {
            return ra.createAt < rb.createAt ? -1 : 1;
          });
          return this.userAccessor.listByIds$(relations.map(r => r.objectId));
        }),
        catchError(error => {
          this.emcee.error(`無法載入等候索取名單，錯誤原因：${error.message}`);
          return [];
        })
      );
  }

  async cancelRequest(itemId: string) {
    let item: TheThing;
    try {
      const user = await this.authenticator.requestLogin();
      item = await this.theThingFactory.load(itemId, ImitationItem.collection);
      const hasRequested = await this.hasRequestedBorrowItem$(item.id)
        .pipe(take(1))
        .toPromise();
      if (!hasRequested) {
        this.emcee.warning(`你並沒有索取 ${item.name} 喔`);
        return;
      }
      const confirm = await this.emcee.confirm(`要取消索取 ${item.name} 嗎？`);
      if (confirm) {
        item.removeUsersOfRole(RelationshipItemRequester.role, [user.id]);
        await this.theThingAccessor.update(item, 'users', item.users);
        await this.relationFactory.waitRelation(
          item.id,
          user.id,
          RelationshipItemRequester.role,
          true
        );
        this.emcee.info(`已取消索取 ${item.name}`);
      }
    } catch (error) {
      this.emcee.error(
        `取消索取 ${!!item ? item.name : itemId} 失敗，錯誤原因：${
          error.message
        }`
      );
    }
  }

  async transfer(item: TheThing, receiver: User, newLocation: Location) {
    try {
      item.setCellValue(ImitationItemCells.location.id, newLocation);
      ImitationItem.setState(item, ImitationItem.states.available);
      item.setUserOfRole(RelationshipItemHolder.role, receiver.id);
      item.removeUsersOfRole(RelationshipItemRequester.role, [receiver.id]);
      await this.theThingAccessor.upsert(item);
    } catch (error) {
      const wrapError = new Error(
        `Failed to transfer ${item.name} to ${receiver.name}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  listMyHeldItems$(): Observable<TheThing[]> {
    return this.authenticator.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return throwError(new Error(`User not login`));
        } else {
          return this.relationFactory.findByObjectAndRole$(
            user.id,
            RelationshipItemHolder.role
          );
        }
      }),
      switchMap(relations => {
        if (isEmpty(relations)) {
          return throwError(new Error(`Not found any held item`));
        } else {
          const itemIds = relations.map(r => r.subjectId);
          return this.theThingAccessor.listByIds$(
            itemIds,
            ImitationItem.collection
          );
        }
      }),
      catchError(error => {
        console.error(error.message);
        this.emcee.error(`找不到我持有的寶物，錯誤原因：\n${error.message}`);
        return of([]);
      })
    );
  }

  // find$(itemFilter: ItemFilter): Observable<TheThing[]> {
  //   throw new Error('Method not implemented.');
  // }

  // async save(item: TheThing) {
  //   await this.itemAccessor.save(item);
  //   if (item.id in this.creatingPool) {
  //     const onSave$ = this.creatingPool[item.id].onSave$;
  //     if (onSave$) {
  //       onSave$.next(item);
  //       onSave$.complete();
  //       delete this.creatingPool[item.id];
  //     }
  //   }
  // }
}
