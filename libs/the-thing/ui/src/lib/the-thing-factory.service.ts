import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
  TheThingState,
  TheThingStateChangeRecord
} from '@ygg/the-thing/core';
import { every, extend, get, isEmpty, some } from 'lodash';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subject,
  Subscription,
  throwError
} from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { ImitationFactoryService } from './imitation-factory.service';
import { RelationFactoryService } from './relation-factory.service';
import { TheThingSourceService } from './the-thing-source.service';
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
  isActionGranted$Cache: { [id: string]: Observable<boolean> } = {};
  subscriptions: Subscription[] = [];

  constructor(
    theThingSource: TheThingSourceService,
    imitationFactory: ImitationFactoryService,
    authUiService: AuthenticateUiService,
    emcee: EmceeService,
    commentFactory: CommentFactoryService,
    private authorizeService: AuthorizeService,
    private router: Router,
    private relaitonFactory: RelationFactoryService,
    private dialog: YggDialogService
  ) {
    super(
      theThingSource,
      imitationFactory,
      authUiService,
      emcee,
      commentFactory
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async launchCreation(imitation: TheThingImitation) {
    try {
      const newThing = await this.create(imitation);
      this.router.navigate(['/', 'the-things', imitation.id, newThing.id]);
    } catch (error) {
      this.emcee.error(
        `<h3>建立 ${imitation.name} 失敗\n${error.message}</h3>`
      );
      return Promise.reject(error);
    }
  }

  setMeta(theThing: TheThing, value: any): void {
    extend(theThing, value);
    // this.theThingSource.updateLocal(theThing);
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
          this.theThingSource.updateLocal(theThing);
        }
      }
    }
  }

  async deleteCell(theThing: TheThing, cellId: string) {
    theThing.deleteCell(cellId);
    // this.theThingSource.updateLocal(theThing);
    return;
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
      await this.emcee.error(wrapError.message);
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

  checkPermission$(
    permission: Permission,
    theThing: TheThing,
    imitation: TheThingImitation
  ): Observable<boolean> {
    const theThing$ = this.load$(theThing.id, theThing.collection);
    const user$ = this.authenticator.currentUser$;
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
