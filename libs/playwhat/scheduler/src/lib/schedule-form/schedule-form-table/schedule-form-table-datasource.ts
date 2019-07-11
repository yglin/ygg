import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, tap } from 'rxjs/operators';
import {
  Observable,
  Subscription,
  BehaviorSubject,
  isObservable,
  of
} from 'rxjs';
import { ScheduleForm } from '../schedule-form';

/**
 * Data source for the ScheduleFormTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ScheduleFormTableDataSource extends DataSource<ScheduleForm> {
  _paginator: MatPaginator;
  paginatorSubscription: Subscription;
  _sort: MatSort;
  sortSubscription: Subscription;
  _filter: string;

  data: ScheduleForm[];
  updateEvent$: BehaviorSubject<any>;

  constructor(dataSource: Observable<ScheduleForm[]> | ScheduleForm[]) {
    super();

    // Build the data flow
    this.updateEvent$ = new BehaviorSubject(null);
    let dataSource$: Observable<ScheduleForm[]>;
    if (isObservable(dataSource)) {
      dataSource$ = dataSource;
    } else if (dataSource) {
      dataSource$ = of(dataSource);
    } else {
      dataSource = of([]);
    }
    dataSource$
      .pipe(tap(data => (this.data = data)))
      .subscribe(this.updateEvent$);
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
  }

  get sort(): MatSort {
    return this._sort;
  }

  set filter(value: string) {
    this._filter = value;
    // When filter changed, move back to the first page.
    this.paginator.firstPage();
    this.updateEvent$.next(null);
  }

  get filter(): string {
    return this._filter;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ScheduleForm[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
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
  disconnect() {
    if (this.paginatorSubscription) {
      this.paginatorSubscription.unsubscribe();
    }
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
  }

  /**
   * Combine a series of proccesses which altering data, such as pagination, sorting, ...etc.
   * Also do a shallow copy avoid mutation of original data.
   *
   * @param data Original data to be processed
   * @returns Processed output data
   */
  getProcessedData(data: ScheduleForm[]): ScheduleForm[] {
    let outputData: ScheduleForm[] = [...data];
    outputData = this.getFilteredData(outputData);
    if (this.sort) {
      outputData = this.getSortedData(outputData);
    }
    if (this.paginator) {
      outputData = this.getPagedData(outputData);
    }
    return outputData;
  }

  getFilteredData(data: ScheduleForm[]) {
    if (!this.filter) {
      return data;
    } else {
      return data.filter(form => {
        const keyword = this.filter;
        const searchingText = JSON.stringify(form.contacts) + form.groupName + form.likesDescription + form.transpotation + form.transpotationHelp + form.accommodationHelp;
        return searchingText.includes(keyword);
      });
    }
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ScheduleForm[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ScheduleForm[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'dateRange':
          if (a.dateRange && b.dateRange) {
            return compare(a.dateRange.start, b.dateRange.start, isAsc);
          } else if (a.dateRange) {
            return 1;
          } else if (b.dateRange) {
            return -1;
          } else {
            return 0;
          }
        case 'numParticipants':
          return compare(a.numParticipants, b.numParticipants, isAsc);
        case 'agent':
          return compare(a.agentId, b.agentId, isAsc);
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
