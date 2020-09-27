import { DataAccessor } from '@ygg/shared/infra/core';
import { isEmpty } from 'lodash';
import { Subject, Observable, merge, BehaviorSubject, ReplaySubject } from 'rxjs';
import { filter, shareReplay, tap } from 'rxjs/operators';
import { TheThing } from '../the-thing';
import { TheThingAccessor } from './the-thing-accessor';

export abstract class TheThingSource extends TheThingAccessor {
  constructor(protected dataAccessor: DataAccessor) {
    super(dataAccessor);
  }

  theThingSourcePool: {
    [id: string]: {
      local$: Subject<TheThing>;
      remote$: Observable<TheThing>;
      valueChange$: Observable<TheThing>;
    };
  } = {};

  createTheThingSource$(id: string, collection: string) {
    const local$ = new ReplaySubject<TheThing>(1);
    // console.log(`Connect to data source ${collection}/${id}`);
    const remote$ = super.load$(id, collection)
    const valueChange$ = merge(
      local$,//.pipe(tap(() => console.log(`Change from local, id ${id}`))),
      remote$//.pipe(tap(() => console.log(`Change from remote, id ${id}`)))
    ).pipe(
      filter(theThing => !isEmpty(theThing)),
      shareReplay(1)
    );
    this.theThingSourcePool[id] = {
      local$,
      remote$,
      valueChange$
    };
  }

  hasSource(id: string): boolean {
    return id in this.theThingSourcePool;
  }

  updateLocal(newThing: TheThing) {
    if (!this.hasSource(newThing.id)) {
      this.createTheThingSource$(newThing.id, newThing.collection);
    }
    this.theThingSourcePool[newThing.id].local$.next(newThing);
  }

  load$(
    id: string,
    collection: string = TheThing.collection
  ): Observable<TheThing> {
    // console.log(`Load TheThing ${id}`);
    if (!this.hasSource(id)) {
      this.createTheThingSource$(id, collection);
    }
    return this.theThingSourcePool[id].valueChange$;
  }
}
