import { Observable, Subject, of, throwError } from 'rxjs';
import { TheThing } from '..';
import { tap, map, switchMap } from 'rxjs/operators';
import { extend } from 'lodash';

type InputAction = 'meta' | 'add-cell' | 'create' | 'save' | 'load';

export interface IUserInput {
  type: InputAction;
  data: any;
}

export class TheThingFactory {
  input$: Subject<IUserInput> = new Subject();
  output$: Observable<TheThing>;
  theThing: TheThing;

  constructor() {
    this.output$ = this.input$.pipe(
      switchMap(input => {
        if (!this.theThing) {
          return throwError(`Not create nor load any thing yet.`);
        }
        switch (input.type) {
          case 'meta':
            extend(this.theThing, input.data);
            break;
          case 'add-cell':
            this.theThing.addCell(input.data);
            break;
          case 'create':
            return this.create(input.data);
          case 'load':
            return this.load(input.data);
          case 'save':
            return this.save(input.data);
          default:
            break;
        }
        return of(this.theThing);
      }),
      map(() => this.theThing)
    );
  }

  async create(options: any): Promise<TheThing> {}
}
