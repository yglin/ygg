import { Observable, combineLatest } from 'rxjs';
import { TheThing, TheThingMapFinder } from '@ygg/the-thing/core';
import { BoxFactory } from './box-factory';
import { GeoBound } from '@ygg/shared/geography/core';
import { switchMap, map } from 'rxjs/operators';
import { ImitationItem } from '../models';

export abstract class MapSearcher {
  constructor(
    private boxFactory: BoxFactory,
    private theThingMapFinder: TheThingMapFinder
  ) {}

  searchItemsInBound$(bound: GeoBound): Observable<TheThing[]> {
    const itemIdsInBound$: Observable<string[]> = this.theThingMapFinder
      .findInBound$(bound)
      .pipe(
        map(locationRecords =>
          locationRecords
            .filter(lr => lr.objectCollection === ImitationItem.collection)
            .map(lr => lr.objectId)
        )
      );

    return combineLatest([
      itemIdsInBound$,
      this.boxFactory.listMyManifestItems$()
    ]).pipe(
      map(([itemIdsInBound, myManifestItems]) => {
        // console.log(itemIdsInBound);
        // console.log(myManifestItems);
        return myManifestItems.filter(item => itemIdsInBound.includes(item.id));
      })
    );
  }
}
