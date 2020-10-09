import { Subject, Observable } from 'rxjs';
import { TheThing } from '../the-thing';
import { TheThingImitation } from '../imitation';
import { TheThingState, TheThingStateChangeRecord } from '../state';
import { TheThingAction } from '../action';
import { TheThingAccessor } from './the-thing-accessor';
import { ImitationFactory } from './imitatioin-factory';
import { TheThingSource } from './the-thing-source';
import { defaults, get } from 'lodash';
import { Authenticator } from '@ygg/shared/user/core';
import { AlertType, Emcee } from '@ygg/shared/infra/core';
import { Html } from '@ygg/shared/omni-types/core';
import { CommentFactory } from '@ygg/shared/thread/core';

// type InputAction = 'meta' | 'add-cell' | 'create' | 'save' | 'load';

// export interface IUserInput {
//   type: InputAction;
//   data: any;
// }

export abstract class TheThingFactoryBasic {
  abstract async setState(
    thing: TheThing,
    imitation: TheThingImitation,
    state: TheThingState
  ): Promise<TheThingStateChangeRecord>;
}

export abstract class TheThingFactory extends TheThingFactoryBasic {
  onSave$: Subject<TheThing>;
  runAction$: Subject<{
    theThing: TheThing;
    action: TheThingAction;
  }> = new Subject();
  createCache: { [imitationId: string]: TheThing } = {};
  creationChainStack: Subject<TheThing>[] = [];

  constructor(
    protected theThingSource: TheThingSource,
    protected imitationFactory: ImitationFactory,
    protected authenticator: Authenticator,
    protected emcee: Emcee,
    protected commentFactory: CommentFactory
  ) {
    super();
  }

  async create(imitation: TheThingImitation): Promise<TheThing> {
    try {
      // console.debug(`Create new TheThing of ${imitation.name}`);

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

      this.theThingSource.createTheThingSource$(
        newThing.id,
        newThing.collection
      );
      this.theThingSource.updateLocal(newThing);
      // if (!(newThing.id in this.theThingSources$)) {
      //   this.createTheThingSource$(newThing.id, newThing.collection);
      //   this.theThingSources$[newThing.id].local$.next(newThing);
      // }
      // // console.log(`Created new thing ${newThing.id}`);

      return newThing;
    } catch (error) {
      const imitationName = get(imitation, 'name', 'Unknown');
      const wrapError = new Error(
        `Failed to create TheThing of ${imitationName}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }

  load$(id: string, collection: string): Observable<TheThing> {
    return this.theThingSource.load$(id, collection);
  }

  async save(
    theThing: TheThing,
    imitation: TheThingImitation,
    options: {
      requireOwner?: boolean;
      force?: boolean;
    }
  ): Promise<TheThing> {
    options = defaults(options, {
      requireOwner: true
    });
    try {
      if (options.requireOwner && !theThing.ownerId) {
        const currentUser = await this.authenticator.requestLogin();
        theThing.ownerId = currentUser.id;
      }
      let confirm: boolean;
      if (options.force) {
        confirm = true;
      } else {
        confirm = await this.emcee.confirm(
          `<h3>確定要儲存 ${theThing.name} ？</h3>`
        );
      }
      if (!confirm) {
        return;
      }
      this.emcee.showProgress({ message: `儲存 ${theThing.name}` });
      if (imitation && typeof imitation.preSave === 'function') {
        theThing = imitation.preSave(theThing);
      }
      if (
        'onSave' in imitation.stateChanges &&
        imitation.isState(theThing, imitation.stateChanges['onSave'].previous)
      ) {
        imitation.setState(theThing, imitation.stateChanges['onSave'].next);
      }
      await this.theThingSource.upsert(theThing);
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
          await this.emcee.info(`<h3>已成功儲存 ${result.name}</h3>`);
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
      await this.emcee.error(`<h3>儲存失敗，錯誤原因：${error.message}</h3>`);
      return Promise.reject(error);
    } finally {
      this.emcee.hideProgress();
    }
  }

  async load(id: string, collection: string): Promise<TheThing> {
    return this.theThingSource.load(id, collection);
  }

  abstract async inquireStateChangeRecord(
    imitation: TheThingImitation,
    theThing: TheThing,
    oldState: TheThingState,
    newState: TheThingState
  ): Promise<TheThingStateChangeRecord>;

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
      const user = await this.authenticator.requestLogin();
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

      await this.theThingSource.update(
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

  runAction(action: TheThingAction, theThing: TheThing) {
    this.runAction$.next({
      theThing,
      action
    });
  }
}

// export class TheThingFactory {
//   input$: Subject<IUserInput> = new Subject();
//   output$: Observable<TheThing>;
//   theThing: TheThing;

//   constructor() {
//     this.output$ = this.input$.pipe(
//       switchMap(input => {
//         if (!this.theThing) {
//           return throwError(`Not create nor load any thing yet.`);
//         }
//         switch (input.type) {
//           case 'meta':
//             extend(this.theThing, input.data);
//             break;
//           case 'add-cell':
//             this.theThing.addCell(input.data);
//             break;
//           case 'create':
//             return this.create(input.data);
//           case 'load':
//             return this.load(input.data);
//           case 'save':
//             return this.save(input.data);
//           default:
//             break;
//         }
//         return of(this.theThing);
//       }),
//       map(() => this.theThing)
//     );
//   }

//   async create(options: any): Promise<TheThing> {}
// }
