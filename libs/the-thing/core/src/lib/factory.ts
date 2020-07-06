import { Subject, Observable } from 'rxjs';
import { TheThing } from './the-thing';
import { TheThingImitation } from './imitation';

// type InputAction = 'meta' | 'add-cell' | 'create' | 'save' | 'load';

// export interface IUserInput {
//   type: InputAction;
//   data: any;
// }

export abstract class TheThingFactory {
  onSave$: Subject<TheThing>;
  abstract async create(options: {
    imitationId?: string;
    imitation: TheThingImitation;
  }): Promise<TheThing>;
  abstract load$(id: string, collection: string): Observable<TheThing>;
  abstract async load(id: string, collection: string): Promise<TheThing>;
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
