import { TheThing, TheThingFactory } from '@ygg/the-thing/core';
import { Router, Emcee } from '@ygg/shared/infra/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { ImitationItem, ItemFilter } from '../models';
import { take, filter } from 'rxjs/operators';
import { ItemAccessor } from './item-accessor';

export class ItemFactory {
  // creatingPool: {
  //   [id: string]: {
  //     local$: BehaviorSubject<TheThing>;
  //     // onSave$: Subject<TheThing>;
  //   };
  // } = {};

  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected itemAccessor: ItemAccessor,
    protected theThingFactory: TheThingFactory
  ) {}

  async create(): Promise<TheThing> {
    try {
      const newItem = await this.theThingFactory.create({
        imitation: ImitationItem
      });
      this.router.navigate(['/', ImitationItem.routePath, newItem.id]);
      return this.theThingFactory.onSave$
        .pipe(
          filter(thing => thing.id === newItem.id),
          take(1)
        )
        .toPromise()
        .then(result => {
          return result;
        });
    } catch (error) {
      this.emcee.error(`新增寶物失敗，錯誤原因：${error.message}`);
      return;
    }
  }

  async load(id: string): Promise<Observable<TheThing>> {
    return this.theThingFactory.load$(id, ImitationItem.collection);
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
