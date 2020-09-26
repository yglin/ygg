import { Subject, Observable } from 'rxjs';
import { TheThing } from '../the-thing';
import { TheThingImitation } from '../imitation';
import { TheThingState, TheThingStateChangeRecord } from '../state';
import { TheThingAction } from '../action';
import { TheThingAccessor } from '../the-thing-accessor';
import { ImitationFactory } from './imitatioin-factory';

// type InputAction = 'meta' | 'add-cell' | 'create' | 'save' | 'load';

// export interface IUserInput {
//   type: InputAction;
//   data: any;
// }

export abstract class TheThingFactory {
  onSave$: Subject<TheThing>;
  runAction$: Subject<{
    theThing: TheThing;
    action: TheThingAction;
  }> = new Subject();

  constructor(
    protected theThingAccessor: TheThingAccessor,
    protected imitationFactory: ImitationFactory
  ) {}

  abstract async create(imitation: TheThingImitation): Promise<TheThing>;
  abstract load$(id: string, collection: string): Observable<TheThing>;
  abstract async save(
    theThing: TheThing,
    options?: {
      requireOwner?: boolean;
      imitation?: TheThingImitation;
      force?: boolean;
    }
  ): Promise<TheThing>;
  abstract async setState(
    thing: TheThing,
    imitation: TheThingImitation,
    state: TheThingState,
    options?: {
      force?: boolean;
    }
  ): Promise<TheThingStateChangeRecord>;

  async load(id: string, collection: string): Promise<TheThing> {
    return this.theThingAccessor.load(id, collection);
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
