import { Injectable } from '@angular/core';
import { ItemFilter, Item } from '@ygg/ourbox/core';
import { Observable, of } from 'rxjs';
import { range, random } from 'lodash';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemFactoryService {
  items$: Observable<Item[]>;

  constructor() {
    this.items$ = of(this.forgeItems());
  }

  forgeItems(): Item[] {
    const items = range(random(100, 200)).map(() => Item.forge());
    return items;
  }

  find(filter: ItemFilter): Observable<Item[]> {
    return this.items$.pipe(
      map(items => filter.filter(items)),
      // tap(items => console.log(`Find ${items.length} items`))
    );
  }
}
