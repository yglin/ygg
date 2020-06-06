import { Injectable, OnDestroy } from '@angular/core';
import {
  TheThing,
  TheThingImitation,
  TheThingCell,
  TheThingState,
  stateConfirmMessage,
  Relationship,
  TheThingRelation,
  TheThingAction
} from '@ygg/the-thing/core';
import {
  AuthenticateService,
  AuthenticateUiService,
  AuthorizeService
} from '@ygg/shared/user/ui';
import {
  take,
  first,
  timeout,
  shareReplay,
  map,
  filter,
  catchError
} from 'rxjs/operators';
import {
  TheThingImitationAccessService,
  TheThingAccessService
} from '@ygg/the-thing/data-access';
import { TheThingImitationViewInterface } from './the-thing/the-thing-imitation-view/imitation-view-interface.component';
import { YggDialogService, EmceeService } from '@ygg/shared/ui/widgets';
import { AlertType } from '@ygg/shared/infra/core';
import {
  Observable,
  BehaviorSubject,
  Subject,
  combineLatest,
  of,
  Subscription,
  throwError,
  ReplaySubject,
  isObservable,
  never
} from 'rxjs';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
  Router
} from '@angular/router';
import { extend, values, isEmpty, get, keys } from 'lodash';

export interface ITheThingCreateOptions {
  imitation?: string;
}

export interface ITheThingSaveOptions {
  requireOwner?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TheThingFactoryService
  implements OnDestroy, Resolve<Observable<TheThing>> {
  imitation: TheThingImitation;
  // theThing$: BehaviorSubject<TheThing> = new BehaviorSubject(null);
  focusChange$: BehaviorSubject<Observable<TheThing>> = new BehaviorSubject(
    null
  );
  createCache: { [imitationId: string]: TheThing } = {};
  theThingSources$: {
    [id: string]: {
      local$: Subject<TheThing>;
      remote$?: Observable<TheThing>;
    };
  } = {};
  creationChainStack: Subject<TheThing>[] = [];
  runAction$: Subject<{
    theThing: TheThing;
    action: TheThingAction;
  }> = new Subject();
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthenticateService,
    private authUiService: AuthenticateUiService,
    private authorizeService: AuthorizeService,
    private theThingAccessService: TheThingAccessService,
    private imitationAccessServcie: TheThingImitationAccessService,
    private emceeService: EmceeService,
    private router: Router
  ) {}

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

  // setSubjectCells(cellNames: string[]) {
  //   this.subjectCells = cellNames;
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
    } = {}
  ): Promise<TheThing> {
    let newThing: TheThing;
    if (
      options.imitationId &&
      !(this.imitation && this.imitation.id === options.imitationId)
    ) {
      try {
        this.imitation = await this.imitationAccessServcie
          .get$(options.imitationId)
          .pipe(first(), timeout(3000))
          .toPromise();
      } catch (error) {
        console.error(error.message);
        throw error;
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

  async load(id: string): Promise<TheThing> {
    return this.load$(id)
      .pipe(take(1))
      .toPromise();
  }

  connectRemoteSource(id: string) {
    if (!(id in this.theThingSources$)) {
      // Not created, directly load from remote
      this.theThingSources$[id] = {
        local$: new ReplaySubject(1)
      };
    }
    if (!this.theThingSources$[id].remote$) {
      this.theThingSources$[id].remote$ = this.theThingAccessService.get$(id);
      this.subscriptions.push(
        this.theThingSources$[id].remote$.subscribe(theThing => {
          console.log(`Remote change of theThing ${theThing.id}`);
          this.theThingSources$[id].local$.next(theThing);
        })
      );
    }
  }

  load$(id: string): Observable<TheThing> {
    if (!(id in this.theThingSources$)) {
      // Not created, directly load from remote
      this.connectRemoteSource(id);
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
          source === `cell.${cell.name}` &&
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

  async deleteCell(theThing: TheThing, cellName: string) {
    theThing.deleteCell(cellName);
    return;
  }

  async setState(
    theThing: TheThing,
    imitation: TheThingImitation,
    state: TheThingState
  ) {
    try {
      const confirmMessage = stateConfirmMessage(theThing, state);
      const confirm = await this.emceeService.confirm(confirmMessage);
      if (confirm) {
        imitation.setState(theThing, state);
        await this.theThingAccessService.upsert(theThing);
      }
    } catch (error) {
      this.emceeService.error(`狀態設定失敗，錯誤原因：${error.message}`);
    }
  }

  async save(
    theThing: TheThing,
    options: ITheThingSaveOptions = {
      requireOwner: true
    }
  ): Promise<TheThing> {
    if (options.requireOwner && !theThing.ownerId) {
      try {
        const currentUser = await this.authUiService.requireLogin();
        theThing.ownerId = currentUser.id;
      } catch (error) {
        return Promise.reject(error);
      }
    }
    try {
      const confirm = await this.emceeService.confirm(
        `確定要儲存 ${theThing.name} ？`
      );
      await this.theThingAccessService.upsert(theThing);
      // Connect to remote source
      this.connectRemoteSource(theThing.id);

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
      console.log(`TheThing ${theThing.id} saved`);
      const result = await this.load(theThing.id);
      // this.theThingSources$[result.id].local$.next(result);
      if (!!result) {
        await this.emceeService.info(`已成功儲存 ${result.name}`);
        // if (theThing.id in this.theThingSources$) {
        //   this.theThingSources$[theThing.id].next(result);
        // }
      } else {
        throw new Error(`Failed to load back ${theThing.id}`);
      }
      return result;
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

  getPermittedActions$(
    theThing: TheThing,
    imitation: TheThingImitation
  ): Observable<TheThingAction[]> {
    const isOwner$ = this.authorizeService.isOwner$(theThing);
    const isAdmin$ = this.authorizeService.isAdmin$();
    return combineLatest([isOwner$, isAdmin$]).pipe(
      map(([isOwner, isAdmin]) => {
        return values(imitation.actions).filter(action => {
          if (isEmpty(action.permissions)) {
            return true;
          }
          for (const permission of action.permissions) {
            // console.log(permission);
            switch (permission) {
              case 'requireOwner':
                if (!isOwner) {
                  console.warn(
                    `action ${action.id} requires owner but isOwner = ${isOwner}!!`
                  );
                  return false;
                }
                break;
              case 'requireAdmin':
                if (!isAdmin) {
                  console.warn(
                    `action ${action.id} requires owner but isAdmin = ${isAdmin}!!`
                  );
                  return false;
                }
                break;

              default:
                // permission indicate a specific state
                const state = get(imitation.states, permission, null);
                if (!state || !imitation.isState(theThing, state)) {
                  console.warn(
                    `action ${action.id} require state ${permission}`
                  );
                  return false;
                }
                break;
            }
          }
          // console.log(`action ${action.id} granted`);
          return true;
        });
      })
    );
  }

  runAction(action: TheThingAction, theThing: TheThing) {
    this.runAction$.next({
      theThing,
      action
    });
  }
}
