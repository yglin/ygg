import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, tap } from 'rxjs/operators';
import {
  Observable,
  of as observableOf,
  merge,
  BehaviorSubject,
  isObservable,
  of,
  Subscription
} from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { isEmpty, sortBy } from 'lodash';
import { OmniTypeComparator } from '@ygg/shared/omni-types/core';

/**
 * Data source for the TheThing view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TheThingDataSource extends DataSource<TheThing> {
  _paginator: MatPaginator;
  paginatorSubscription: Subscription;
  _sort: MatSort;
  sortSubscription: Subscription;
  data: TheThing[] = [];
  updateEvent$: BehaviorSubject<any>;
  compareFunctions: { [key: string]: OmniTypeComparator } = {};
  _filter: string;

  constructor(
    dataSource: Observable<TheThing[]> | TheThing[],
    compareFunctions?: { [key: string]: OmniTypeComparator }
  ) {
    super();
    // Build the data flow
    this.updateEvent$ = new BehaviorSubject(null);
    let dataSource$: Observable<TheThing[]>;
    if (isObservable(dataSource)) {
      dataSource$ = dataSource;
    } else if (dataSource) {
      dataSource$ = of(dataSource);
    } else {
      dataSource = of([]);
    }
    dataSource$
      .pipe(
        // tap(data => console.dir(data)),
        tap(data => (this.data = data))
      )
      .subscribe(this.updateEvent$);
    if (!isEmpty(compareFunctions)) {
      this.compareFunctions = compareFunctions;
    }
  }

  set filter(value: string) {
    this._filter = value;
    this.updateEvent$.next(true);
  }

  set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (this.paginatorSubscription) {
      this.paginatorSubscription.unsubscribe();
    }
    this.paginatorSubscription = this._paginator.page.subscribe(
      this.updateEvent$
    );
  }

  get paginator(): MatPaginator {
    return this._paginator;
  }

  set sort(sort: MatSort) {
    // console.log(sort);
    this._sort = sort;
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
    this.sortSubscription = this._sort.sortChange.subscribe(this.updateEvent$);
    // this.updateEvent$.next(this.data);
  }

  get sort(): MatSort {
    return this._sort;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TheThing[]> {
    return this.updateEvent$.pipe(
      map(() => {
        // return this.data;
        return this.getProcessedData(this.data);
        // return this.getPagedData(this.getSortedData([...this.data]));
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Combine a series of proccesses which altering data, such as pagination, sorting, ...etc.
   * Also do a shallow copy avoid mutation of original data.
   *
   * @param data Original data to be processed
   * @returns Processed output data
   */
  getProcessedData(data: TheThing[]): TheThing[] {
    let outputData: TheThing[] = [...data];
    if (!!this._filter) {
      outputData = this.getFilteredData(outputData);
    }
    if (this.sort) {
      outputData = this.getSortedData(outputData);
    }
    if (this.paginator) {
      outputData = this.getPagedData(outputData);
    }
    return outputData;
  }

  /**
   * Filter the-things by search text this._filter,
   * Check TheThing JSON include this._filter
   *
   * @param data original data of the-things array
   */
  private getFilteredData(data: TheThing[]): TheThing[] {
    return data.filter(theThing =>
      JSON.stringify(theThing).includes(this._filter)
    );
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TheThing[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TheThing[]) {
    // console.log(this.sort);
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    const isAsc = this.sort.direction === 'asc';
    let comparator: (a: TheThing, b: TheThing) => number;

    if (this.sort.active === 'createAt') {
      // console.log('幹');
      comparator = (a: TheThing, b: TheThing) =>
        (a.createAt - b.createAt) * (isAsc ? 1 : -1);
    } else if (this.sort.active in this.compareFunctions) {
      const cellId = this.sort.active;
      const cellComparator = this.compareFunctions[cellId];
      // console.log(cellId);
      // console.dir(cellComparator);
      comparator = (a: TheThing, b: TheThing) =>
        cellComparator(
          a.getCellValue(cellId),
          b.getCellValue(cellId),
          isAsc
        );
    }
    if (comparator) {
      data.sort(comparator);
    }
    return data;
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
