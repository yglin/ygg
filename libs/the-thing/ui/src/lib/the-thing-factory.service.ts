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
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
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
  TheThingState,
  TheThingStateChangeRecord
} from '@ygg/the-thing/core';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { defaults, every, extend, get, isEmpty, some } from 'lodash';
import {
  BehaviorSubject,
  combineLatest,
  merge,
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
  filter,
  first,
  map,
  shareReplay,
  switchMap,
  take,
  timeout
} from 'rxjs/operators';
import { ImitationFactoryService } from './imitation-factory.service';
import { RelationFactoryService } from './relation-factory.service';
import { TheThingAccessService } from './the-thing-access.service';
import { TheThingStateChangeRecordComponent } from './the-thing/the-thing-state-change-record/the-thing-state-change-record.component';

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
  implements OnDestroy {
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
    theThingAccessService: TheThingAccessService,
    imitationFactory: ImitationFactoryService,
    private authUiService: AuthenticateUiService,
    private authorizeService: AuthorizeService,
    private emceeService: EmceeService,
    private router: Router,
    private relaitonFactory: RelationFactoryService,
    private commentFactory: CommentFactoryService,
    private dialog: YggDialogService
  ) {
    super(theThingAccessService, imitationFactory);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
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

  async create(imitation: TheThingImitation): Promise<TheThing> {
    try {
      if (!imitation) {
        throw new Error(`Can not create TheThing without specified Imitation`);
      }

      let newThing: TheThing;
      if (imitation.id in this.createCache) {
        newThing = this.createCache[imitation.id];
      } else {
        newThing = imitation.createTheThing();
        this.createCache[imitation.id] = newThing;
      }

      if (!(newThing.id in this.theThingSources$)) {
        this.theThingSources$[newThing.id] = {
          local$: new ReplaySubject(1)
        };
        this.theThingSources$[newThing.id].local$.next(newThing);
      }
      // console.log(`Created new thing ${newThing.id}`);

      return newThing;
    } catch (error) {
      const imitationName = get(imitation, 'name', 'Unknown');
      const wrapError = new Error(
        `Failed to create TheThing of ${imitationName}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  async launchCreation(imitation: TheThingImitation) {
    try {
      const newThing = await this.create(imitation);
      this.router.navigate(['/', 'the-things', imitation.id, newThing.id]);
    } catch (error) {
      this.emceeService.error(
        `<h3>建立 ${imitation.name} 失敗\n${error.message}</h3>`
      );
      return Promise.reject(error);
    }
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

  // connectRemoteSource(id: string, collection: string = TheThing.collection) {
  //   if (!(id in this.theThingSources$)) {
  //     // Not created, directly load from remote
  //     console.log(`Instantiate local$ of ${id}`);
  //     this.theThingSources$[id] = {
  //       local$: new ReplaySubject(1)
  //     };
  //   }
  //   if (!this.theThingSources$[id].remote$) {
  //     this.theThingSources$[id].remote$ = this.theThingAccessor.load$(
  //       id,
  //       collection
  //     );
  //     this.subscriptions.push(
  //       this.theThingSources$[id].remote$.subscribe(theThing => {
  //         console.log(`Forward remote change of theThing ${theThing.id}`);
  //         this.theThingSources$[id].local$.next(theThing);
  //       })
  //     );
  //   }
  // }

  load$(
    id: string,
    collection: string = TheThing.collection
  ): Observable<TheThing> {
    // console.log(`Load TheThing ${id}`);
    if (!(id in this.theThingSources$)) {
      this.theThingSources$[id] = {
        local$: new ReplaySubject(1)
      };
    }
    if (!this.theThingSources$[id].remote$) {
      this.theThingSources$[id].remote$ = this.theThingAccessor.load$(
        id,
        collection
      );
    }
    return merge(
      this.theThingSources$[id].local$,
      this.theThingSources$[id].remote$
    ).pipe(filter(theThing => !isEmpty(theThing)));
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
  ): Promise<TheThingStateChangeRecord> {
    try {
      const oldState = imitation.getState(theThing);
      if (state.name === oldState.name) {
        throw new Error(`${theThing.name} 的狀態已經是 ${state.label}`);
      }
      const user = await this.authUiService.requestLogin();
      let changeRecord: TheThingStateChangeRecord = null;

      let changeMessage = `📌 ${user.name} 更改狀態 <b>${
        !!oldState ? oldState.label : '未知狀態'
      } ➡ ${state.label}</b>`;
      if (state.requireChangeRecord) {
        changeRecord = await this.inquireStateChangeRecord(
          imitation,
          theThing,
          oldState,
          state
        );
        if (changeRecord && changeRecord.message) {
          changeMessage += `<br/>說明：${changeRecord.message.content}`;
        }
      }

      imitation.setState(theThing, state);

      await this.theThingAccessor.update(
        theThing,
        `states.${imitation.stateName}`,
        state.value
      );

      // log state change as comment
      await this.commentFactory.addComment(
        theThing.id,
        new Html(changeMessage)
      );

      return changeRecord;
    } catch (error) {
      const wrapError = new Error(
        `更改 ${theThing.name} 的狀態為 ${state.label} 失敗,錯誤原因：\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  async inquireStateChangeRecord(
    imitation: TheThingImitation,
    theThing: TheThing,
    oldState: TheThingState,
    newState: TheThingState
  ): Promise<TheThingStateChangeRecord> {
    try {
      const dialogRef = this.dialog.open(TheThingStateChangeRecordComponent, {
        title: '狀態修改紀錄',
        data: {
          imitation,
          theThing,
          oldState,
          newState
        }
      });
      const changeRecord: TheThingStateChangeRecord = await dialogRef
        .afterClosed()
        .pipe(take(1))
        .toPromise();
      if (!changeRecord) {
        throw new Error(`使用者取消`);
      } else {
        return changeRecord as TheThingStateChangeRecord;
      }
    } catch (error) {
      const wrapError = new Error(
        `無法取得狀態修改的紀錄，錯誤原因：\n${error.message}`
      );
      await this.emceeService.error(wrapError.message);
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
      imitation: TheThingImitation;
      requireOwner?: boolean;
      force?: boolean;
    }
  ): Promise<TheThing> {
    options = defaults(options, {
      requireOwner: true
    });
    const imitation: TheThingImitation = options.imitation;
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
          `<h3>確定要儲存 ${theThing.name} ？</h3>`
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
      await this.theThingAccessor.upsert(theThing);
      // await this.saveRelations(theThing);
      // Connect to remote source
      // this.connectRemoteSource(theThing.id, theThing.collection);

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
          await this.emceeService.info(`<h3>已成功儲存 ${result.name}</h3>`);
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
        `<h3>儲存失敗，錯誤原因：${error.message}</h3>`,
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
      .then(object => {
        // Connect relation to created object
        subject.addRelation(relationship.createRelation(subject.id, object.id));
        // Redirect back to current url
        this.router.navigateByUrl(backUrl);
      });

    // Create related object
    this.launchCreation(relationship.objectImitation);
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
    theThing: TheThing,
    imitation: TheThingImitation
  ): Observable<boolean> {
    const theThing$ = this.load$(theThing.id, theThing.collection);
    const user$ = this.authUiService.currentUser$;
    return combineLatest([theThing$, user$]).pipe(
      switchMap(([_theThing, user]) => {
        if (!_theThing) {
          // console.log(`Not found theThing, permission denied`);
          return of(false);
        }

        // yglin 2020/09/25 User can be guest
        // if (!user) {
        //   console.log(`Not found user, permission denied`);
        //   return of(false);
        // }

        // console.log(
        //   `Check permission "${permission}" against TheThing ${theThing.id}`
        // );

        switch (permission) {
          case 'requireOwner':
            if (!user || _theThing.ownerId !== user.id) {
              // console.log(`Not owner, permission denied`);
              return of(false);
            } else {
              return of(true);
            }
          case 'requireAdmin':
            if (!user) {
              return of(false);
            } else {
              return this.authorizeService.isAdmin$(user.id);
            }

          default:
            // permission indicate a specific state
            if (typeof permission === 'string') {
              if (permission.startsWith('role')) {
                if (!user) {
                  return of(false);
                }
                const roles = permission
                  .split(':')[1]
                  .trim()
                  .split(',');
                const roleMatches: Observable<boolean>[] = [];
                for (const role of roles) {
                  let exclude = false;
                  let roleName = role;
                  if (role.startsWith('!')) {
                    roleName = role.substring(1);
                    exclude = true;
                  }
                  roleMatches.push(
                    this.relaitonFactory
                      .hasRelation$(_theThing.id, user.id, roleName)
                      .pipe(map(has => (exclude ? !has : has)))
                  );
                }
                if (isEmpty(roleMatches)) {
                  return of(true);
                } else {
                  return combineLatest(roleMatches).pipe(
                    map(matches => some(matches, Boolean))
                  );
                }
                // console.log(
                //   `Has relation? ${_theThing.id}, ${user.id}, ${role}`
                // );
              } else if (permission.startsWith('state')) {
                const states = permission.split(':')[1].trim();
                const permittedStates: string[] = states
                  .split(',')
                  .map(s => s.trim());
                // console.log(permittedStates);
                let matchAny = false;
                for (const stateName of permittedStates) {
                  const state = get(imitation.states, stateName, null);
                  if (state && imitation.isState(_theThing, state)) {
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
              } else if (permission.startsWith('relations')) {
                const [, condition, relationName] = permission.split(':');
                switch (condition) {
                  case 'has':
                    return this.relaitonFactory
                      .findBySubjectAndRole$(_theThing.id, relationName)
                      .pipe(map(relations => !isEmpty(relations)));

                  default:
                    return of(true);
                }
              }
            } else if (typeof permission === 'function') {
              if (!permission(_theThing)) {
                return of(false);
              }
            } else {
              return of(true);
            }
        }

        return of(true);
      }),
      catchError(error => {
        console.error(error);
        return throwError(
          new Error(
            `Failed to check permission ${permission} of TheThing ${theThing.id}`
          )
        );
      })
    );
  }

  isActionGranted$(
    theThing: TheThing,
    action: TheThingAction,
    imitation: TheThingImitation
  ): Observable<boolean> {
    const cacheId = `${imitation.id}_${action.id}_${theThing.id}`;
    // console.log(`FUCK!! MAMA~`);
    if (!(cacheId in this.isActionGranted$Cache)) {
      if (isEmpty(action.permissions)) {
        // console.log(
        //   `Action ${action.id} has no permissions, granted of course`
        // );
        this.isActionGranted$Cache[cacheId] = of(true);
      } else {
        // console.log(`Check permission of action ${action.id}`);
        const checkPermissions: Observable<boolean>[] = [];
        for (const permission of action.permissions) {
          checkPermissions.push(
            this.checkPermission$(permission, theThing, imitation)
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
