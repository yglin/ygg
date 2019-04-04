
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, tap } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, isObservable, of, Subscription } from 'rxjs';
import { Log } from '../log';

// TODO: Replace this with your own data model type
export type LogListItem = Log;

/**
 * Data source for the LogList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LogListDataSource extends DataSource<LogListItem> {
  _paginator: MatPaginator;
  paginatorSubscription: Subscription;
  _sort: MatSort;
  sortSubscription: Subscription;
  data: LogListItem[];
  updateEvent$: BehaviorSubject<any>;

  constructor(
    dataSource: Observable<LogListItem[]> | LogListItem[]
  ) {
    super();

    // Build the data flow
    this.updateEvent$ = new BehaviorSubject(null);
    let dataSource$: Observable<LogListItem[]>;
    if (isObservable(dataSource)) {
      dataSource$ = dataSource;
    } else if (dataSource) {
      dataSource$ = of(dataSource);
    } else {
      dataSource = of([]);
    }
    dataSource$.pipe(tap(data => this.data = data)).subscribe(this.updateEvent$);
  }

  set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (this.paginatorSubscription) {
      this.paginatorSubscription.unsubscribe();
    }
    this.paginatorSubscription = this._paginator.page.subscribe(this.updateEvent$);
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
  }

  get sort(): MatSort {
    return this._sort;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<LogListItem[]> {
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
  getProcessedData(data: LogListItem[]): LogListItem[] {
    let outputData: LogListItem[] = [...data];
    if (this.sort) {
      outputData = this.getSortedData(outputData);
    }
    if (this.paginator) {
      outputData = this.getPagedData(outputData);
    }
    return outputData;
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: LogListItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: LogListItem[]) {
    // console.log(this.sort);
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'timestamp':
          return compare(+a.timestamp, +b.timestamp, isAsc);
        case 'level':
          return compare(+a.level, +b.level, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
