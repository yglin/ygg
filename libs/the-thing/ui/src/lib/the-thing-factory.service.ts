import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AlertType } from '@ygg/shared/infra/core';
import { Html } from '@ygg/shared/omni-types/core';
import { CommentFactoryService } from '@ygg/shared/thread/ui';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { AuthenticateUiService, AuthorizeService } from '@ygg/shared/user/ui';
import {
  Permission,
  RelationRecord,
  Relationship,
  TheThing,
  TheThingAction,
  TheThingCell,
  TheThingFactory,
  TheThingImitation,
  TheThingRelation,
  TheThingState
} from '@ygg/the-thing/core';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { every, extend, get, isEmpty } from 'lodash';
import {
  BehaviorSubject,
  combineLatest,
  NEVER,
  Observable,
  of,
  race,
  ReplaySubject,
  Subject,
  Subscription,
  throwError
} from 'rxjs';
import {
  catchError,
  first,
  map,
  shareReplay,
  switchMap,
  take,
  timeout
} from 'rxjs/operators';
import { RelationFactoryService } from './relation-factory.service';
import { TheThingAccessService } from './the-thing-access.service';

export interface ITheThingCreateOptions {
  imitation?: string;
}

export interface ITheThingSaveOptions {
  requireOwner?: boolean;
}

export const config = {
  loadTimeout: 10000
};

@Injectable({
  providedIn: 'root'
})
export class TheThingFactoryService extends TheThingFactory
  implements OnDestroy, Resolve<Observable<TheThing>> {
  imitation: TheThingImitation;
  // theThing$: BehaviorSubject<TheThing> = new BehaviorSubject(null);
  focusChange$: BehaviorSubject<Observable<TheThing>> = new BehaviorSubject(
    null
  );
  onSave$: Subject<TheThing> = new Subject();
  createCache: { [imitationId: string]: TheThing } = {};
  theThingSources$: {
    [id: string]: {
      local$: Subject<TheThing>;
      remote$?: Observable<TheThing>;
    };
  } = {};
  creationChainStack: Subject<TheThing>[] = [];
  isActionGranted$Cache: { [id: string]: Observable<boolean> } = {};
  subscriptions: Subscription[] = [];

  constructor(
    private authUiService: AuthenticateUiService,
    private authorizeService: AuthorizeService,
    private theThingAccessService: TheThingAccessService,
    private imitationAccessServcie: TheThingImitationAccessService,
    private emceeService: EmceeService,
    private router: Router,
    private relaitonFactory: RelationFactoryService,
    private commentFactory: CommentFactoryService
  ) {
    super();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise(async (resolve, reject) => {
      try {
        const imitationId = route.paramMap.get('imitation');
        const id = route.paramMap.get('id');
        if (!this.imitation || this.imitation.id !== imitationId) {
          this.imitation = await this.imitationAccessServcie
            .get$(imitationId)
            .pipe(first(), timeout(3000))
            .toPromise();
        }
        let theThing: TheThing;
        if (id === 'create') {
          // console.log(`create ${this.imitation.id}`);
          theThing = await this.create();
          this.router.navigate(['/', 'the-things', imitationId, theThing.id]);
          resolve(of(theThing));
        } else if (!!id) {
          // console.log(`load ${this.imitation.id}:${id}`);
          theThing = await this.load(id);
          const focus$ = this.load$(theThing.id);
          resolve(focus$);
          this.focusChange$.next(focus$);
        } else {
          throw new Error(`Invalid id in route: ${id}`);
        }
      } catch (error) {
        console.error(error.message);
        this.emceeService.error(`載入頁面失敗，錯誤原因：${error.message}`);
        this.router.navigate([]);
        return reject(error);
      }
    });
  }

  // reset() {
  //   this.imitation = null;
  // }

  // getImitation(): TheThingImitation {
  //   return this.imitation;
  // }

  // setImitation(imitaiton: TheThingImitation) {
  //   this.imitation = imitaiton;
  // }

  // async loadTheOne(): Promise<Observable<TheThing>> {
  //   if (!this.theThing$) {
  //     await this.create();
  //   }
  //   return this.theThing$;
  // }

  // setSubjectThing(theThing: TheThing) {
  //   this.reset();
  //   this.subjectThing = theThing;
  // }

  // setSubjectCells(cellIds: string[]) {
  //   this.subjectCells = cellIds;
  // }

  // getSubjectCells(): TheThingCell[] {
  //   return this.subjectThing.getCellsByNames(this.subjectCells);
  // }

  // saveCells(cells: TheThingCell[]) {
  //   this.subjectThing.addCells(cells);
  // }

  async create(
    options: {
      imitationId?: string;
      imitation?: TheThingImitation;
    } = {}
  ): Promise<TheThing> {
    let newThing: TheThing;
    if (options.imitation) {
      this.imitation = options.imitation;
    } else if (
      options.imitationId &&
      !(this.imitation && this.imitation.id === options.imitationId)
    ) {
      try {
        this.imitation = await race(
          this.imitationAccessServcie.get$(options.imitationId).pipe(take(1)),
          NEVER.pipe(timeout(config.loadTimeout))
        ).toPromise();
      } catch (error) {
        const wrapError = new Error(
          `Failed to load imitation: ${options.imitationId};\n${error.message}`
        );
        console.error(wrapError.message);
        throw wrapError;
      }
    }

    if (this.imitation) {
      if (this.imitation.id in this.createCache) {
        newThing = this.createCache[this.imitation.id];
      } else {
        newThing = this.imitation.createTheThing();
        this.createCache[this.imitation.id] = newThing;
      }
    } else {
      throw new Error(`Creating TheThing requires TheThingImitation`);
    }

    if (!(newThing.id in this.theThingSources$)) {
      this.theThingSources$[newThing.id] = {
        local$: new BehaviorSubject(newThing)
      };
      this.theThingSources$[newThing.id].local$.next(newThing);
    }
    return newThing;
  }

  emitChange(theThing: TheThing) {
    if (!(theThing.id in this.theThingSources$)) {
      this.theThingSources$[theThing.id] = {
        local$: new BehaviorSubject(theThing)
      };
    } else {
      this.theThingSources$[theThing.id].local$.next(theThing);
    }
  }

  async load(
    id: string,
    collection: string = TheThing.collection
  ): Promise<TheThing> {
    // console.log(collection);
    // console.log(id);
    // return this.load$(id, collection).pipe(take(1)).toPromise();
    return race(
      this.load$(id, collection).pipe(take(1)),
      NEVER.pipe(
        timeout(config.loadTimeout),
        catchError(error => {
          return throwError(
            new Error(
              `讀取 ${collection}/${id} 失敗，超過${config.loadTimeout /
                1000}秒`
            )
          );
        })
      )
    ).toPromise();
  }

  connectRemoteSource(id: string, collection: string = TheThing.collection) {
    if (!(id in this.theThingSources$)) {
      // Not created, directly load from remote
      this.theThingSources$[id] = {
        local$: new ReplaySubject(1)
      };
    }
    if (!this.theThingSources$[id].remote$) {
      this.theThingSources$[id].remote$ = this.theThingAccessService.load$(
        id,
        collection
      );
      this.subscriptions.push(
        this.theThingSources$[id].remote$.subscribe(theThing => {
          // console.log(`Remote change of theThing ${theThing.id}`);
          this.theThingSources$[id].local$.next(theThing);
        })
      );
    }
  }

  load$(
    id: string,
    collection: string = TheThing.collection
  ): Observable<TheThing> {
    if (!(id in this.theThingSources$)) {
      // Not created, directly load from remote
      this.connectRemoteSource(id, collection);
    }
    return this.theThingSources$[id].local$;
  }

  setMeta(theThing: TheThing, value: any): void {
    extend(theThing, value);
  }

  setCell(
    theThing: TheThing,
    cell: TheThingCell,
    imitation: TheThingImitation
  ): void {
    theThing.upsertCell(cell);
    if (!isEmpty(imitation.pipes)) {
      for (const source in imitation.pipes) {
        if (
          source === `cell.${cell.id}` &&
          imitation.pipes.hasOwnProperty(source)
        ) {
          const pipe = imitation.pipes[source];
          pipe(theThing);
          if (theThing.id in this.theThingSources$) {
            this.theThingSources$[theThing.id].local$.next(theThing);
          }
        }
      }
    }
  }

  async deleteCell(theThing: TheThing, cellId: string) {
    theThing.deleteCell(cellId);
    return;
  }

  async setState(
    theThing: TheThing,
    imitation: TheThingImitation,
    state: TheThingState
  ) {
    try {
      const oldState = imitation.getState(theThing);
      imitation.setState(theThing, state);
      await this.theThingAccessService.update(
        theThing,
        `states.${imitation.stateName}`,
        state.value
      );
      const user = await this.authUiService.requestLogin();

      // log state change as comment
      await this.commentFactory.addComment(
        theThing.id,
        new Html(
          `📌 ${user.name} 更改狀態 <b>${!!oldState ? oldState.label : "未知狀態"} ➡ ${state.label}</b>`
        )
      );
    } catch (error) {
      const wrapError = new Error(
        `Failed to change state of ${theThing.id},\n:${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  async saveRelations(theThing: TheThing) {
    for (const relationName in theThing.relations) {
      if (theThing.relations.hasOwnProperty(relationName)) {
        const relations = theThing.relations[relationName];
        for (const relation of relations) {
          await this.relaitonFactory.save(
            new RelationRecord({
              subjectCollection: theThing.collection,
              subjectId: theThing.id,
              objectCollection: relation.objectCollection,
              objectId: relation.objectId,
              objectRole: relation.name
            })
          );
        }
      }
    }
  }

  async save(
    theThing: TheThing,
    options: {
      requireOwner?: boolean;
      imitation?: TheThingImitation;
      force?: boolean;
    } = {
      requireOwner: true
    }
  ): Promise<TheThing> {
    const imitation: TheThingImitation = options.imitation || this.imitation;
    if (options.requireOwner && !theThing.ownerId) {
      try {
        const currentUser = await this.authUiService.requireLogin();
        theThing.ownerId = currentUser.id;
      } catch (error) {
        return Promise.reject(error);
      }
    }
    try {
      let confirm: boolean;
      if (options.force) {
        confirm = true;
      } else {
        confirm = await this.emceeService.confirm(
          `確定要儲存 ${theThing.name} ？`
        );
      }
      if (!confirm) {
        return;
      }
      if (imitation && typeof imitation.preSave === 'function') {
        theThing = imitation.preSave(theThing);
      }
      if (
        'onSave' in imitation.stateChanges &&
        imitation.isState(theThing, imitation.stateChanges['onSave'].previous)
      ) {
        imitation.setState(theThing, imitation.stateChanges['onSave'].next);
      }
      await this.theThingAccessService.upsert(theThing);
      // await this.saveRelations(theThing);
      // Connect to remote source
      this.connectRemoteSource(theThing.id, theThing.collection);

      // Clear create cache
      for (const imitationId in this.createCache) {
        if (this.createCache.hasOwnProperty(imitationId)) {
          const cachedTheThing = this.createCache[imitationId];
          if (cachedTheThing.id === theThing.id) {
            delete this.createCache[imitationId];
          }
        }
      }
      // Resolve creation chain if any
      if (this.creationChainStack.length > 0) {
        const topSubject = this.creationChainStack.pop();
        topSubject.next(theThing);
      }
      // console.log(`TheThing ${theThing.id} saved`);
      const result = await this.load(theThing.id, theThing.collection);
      // this.theThingSources$[result.id].local$.next(result);
      if (!!result) {
        if (!options.force) {
          await this.emceeService.info(`已成功儲存 ${result.name}`);
        }
        // if (theThing.id in this.theThingSources$) {
        //   this.theThingSources$[theThing.id].next(result);
        // }
        this.onSave$.next(result);
        return result;
      } else {
        throw new Error(`Failed to load back ${theThing.id}`);
      }
    } catch (error) {
      await this.emceeService.alert(
        `儲存失敗，錯誤原因：${error.message}`,
        AlertType.Error
      );
      return Promise.reject(error);
    }
  }

  async createRelationObjectOnTheFly(
    subject: TheThing,
    relationship: Relationship
  ) {
    // Save current url
    const backUrl = this.router.url;

    // Create a listner to wait for the creation of relation object
    // This listner will emit created event when new thing saved, look at this.save()
    // Push the listner on top of creationChainStack
    const waitCreation = new Subject<TheThing>();
    this.creationChainStack.push(waitCreation);
    waitCreation
      .pipe(take(1))
      .toPromise()
      .then(objectThing => {
        // Connect relation to created object
        subject.addRelation(
          new TheThingRelation({
            name: relationship.name,
            subjectId: subject.id,
            objectId: objectThing.id
          })
        );
        // Redirect back to current url
        this.router.navigateByUrl(backUrl);
      });

    // Navigate to the route of new object creation
    const routePath =
      relationship.imitation.routePath || relationship.imitation.id;
    this.router.navigate(['/', 'the-things', routePath, 'create']);
  }

  // getPermittedActions$(
  //   theThing$: Observable<TheThing>,
  //   imitation: TheThingImitation
  // ): Observable<TheThingAction[]> {
  //   const isOwner$ = theThing$.pipe(
  //     switchMap(theThing => this.authorizeService.isOwner$(theThing))
  //   );
  //   const isAdmin$ = this.authorizeService.isAdmin$();
  //   // .pipe(tap(isAdmin => console.log(`User admin changed: ${isAdmin}`)));
  //   return combineLatest([theThing$, isOwner$, isAdmin$]).pipe(
  //     map(([theThing, isOwner, isAdmin]) => {
  //       // console.log(
  //       //   `theThing ${theThing.id}, theThing owner ${theThing.ownerId}, isOwner = ${isOwner}`
  //       // );
  //       return values(imitation.actions).filter(action => {
  //         if (isEmpty(action.permissions)) {
  //           return true;
  //         }
  //         for (const permission of action.permissions) {
  //           // console.log(permission);
  //           switch (permission) {
  //             case 'requireOwner':
  //               if (!isOwner) {
  //                 // console.warn(
  //                 //   `action ${action.id} requires owner but isOwner = ${isOwner}!!`
  //                 // );
  //                 return false;
  //               }
  //               break;
  //             case 'requireAdmin':
  //               if (!isAdmin) {
  //                 // console.warn(
  //                 //   `action ${action.id} requires owner but isAdmin = ${isAdmin}!!`
  //                 // );
  //                 return false;
  //               }
  //               break;

  //             default:
  //               // permission indicate a specific state
  //               if (typeof permission === 'string') {
  //                 const permittedStates: string[] = permission.split(',');
  //                 // console.log(permittedStates);
  //                 let matchAny = false;
  //                 for (const stateName of permittedStates) {
  //                   const state = get(imitation.states, stateName, null);
  //                   if (state && imitation.isState(theThing, state)) {
  //                     matchAny = true;
  //                     break;
  //                   }
  //                 }
  //                 if (!matchAny) {
  //                   // console.warn(
  //                   //   `action ${action.id} require states: ${permission}`
  //                   // );
  //                   return false;
  //                 }
  //               } else if (typeof permission === 'function') {
  //                 if (!permission(theThing)) {
  //                   return false;
  //                 }
  //               }
  //               break;
  //           }
  //         }
  //         // console.log(`action ${action.id} granted`);
  //         return true;
  //       });
  //     })
  //   );
  // }

  checkPermission$(
    permission: Permission,
    theThingId: string,
    imitation: TheThingImitation
  ): Observable<boolean> {
    const theThing$ = this.load$(theThingId);
    const user$ = this.authUiService.currentUser$;
    return combineLatest([theThing$, user$]).pipe(
      switchMap(([theThing, user]) => {
        if (!theThing) {
          return of(false);
        }
        if (!user) {
          return of(false);
        }
        switch (permission) {
          case 'requireOwner':
            if (theThing.ownerId !== user.id) {
              return of(false);
            }
            break;
          case 'requireAdmin':
            return this.authorizeService.isAdmin$(user.id);
            break;

          default:
            // permission indicate a specific state
            if (typeof permission === 'string') {
              if (permission.startsWith('role')) {
                let role = permission.split(':')[1].trim();
                // console.log(
                //   `Has relation? ${theThing.id}, ${user.id}, ${role}`
                // );
                let exclude = false;
                if (role.startsWith('!')) {
                  role = role.substring(1);
                  exclude = true;
                }
                return this.relaitonFactory.hasRelation$(
                  theThing.id,
                  user.id,
                  role
                ).pipe(map(has => exclude ? !has : has));
              } else if (permission.startsWith('state')) {
                const states = permission.split(':')[1].trim();
                const permittedStates: string[] = states
                  .split(',')
                  .map(s => s.trim());
                // console.log(permittedStates);
                let matchAny = false;
                for (const stateName of permittedStates) {
                  const state = get(imitation.states, stateName, null);
                  if (state && imitation.isState(theThing, state)) {
                    matchAny = true;
                    break;
                  }
                }
                if (!matchAny) {
                  // console.warn(
                  //   `action ${action.id} require states: ${permission}`
                  // );
                  return of(false);
                }
              }
            } else if (typeof permission === 'function') {
              if (!permission(theThing)) {
                return of(false);
              }
            }
            break;
        }
        return of(true);
      }),
      catchError(error => {
        console.error(error);
        return throwError(
          new Error(
            `Failed to check permission ${permission}, theThingId: ${theThingId}`
          )
        );
      })
    );
  }

  isActionGranted$(
    theThingId: string,
    action: TheThingAction,
    imitation: TheThingImitation
  ): Observable<boolean> {
    const cacheId = `${action.id}_${theThingId}`;
    // console.log(`FUCK!! MAMA~`);
    if (!(cacheId in this.isActionGranted$Cache)) {
      if (isEmpty(action.permissions)) {
        // console.log(
        //   `Action ${action.id} has no permissions, granted of course`
        // );
        this.isActionGranted$Cache[cacheId] = of(true);
      } else {
        const checkPermissions: Observable<boolean>[] = [];
        for (const permission of action.permissions) {
          checkPermissions.push(
            this.checkPermission$(permission, theThingId, imitation)
          );
        }
        this.isActionGranted$Cache[cacheId] = combineLatest(
          checkPermissions
        ).pipe(
          map(permissionChecks => every(permissionChecks, Boolean)),
          shareReplay(1)
        );
      }
    }
    return this.isActionGranted$Cache[cacheId];
  }
}
