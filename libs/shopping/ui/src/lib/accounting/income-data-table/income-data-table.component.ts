import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IncomeRecordDataSource } from './income-data-table-datasource';
import { Observable, Subscription, of } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { IncomeRecord } from '@ygg/shopping/core';

@Component({
  selector: 'ygg-income-data-table',
  templateUrl: './income-data-table.component.html',
  styleUrls: ['./income-data-table.component.css']
})
export class IncomeRecordDataTableComponent
  implements OnInit, OnDestroy {
  @Input() incomeRecords$: Observable<IncomeRecord[]>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: IncomeRecordDataSource;
  displayedColumns: string[] = ['producer', 'numPurchases', 'totalIncome'];
  selectionModel: SelectionModel<IncomeRecord> = new SelectionModel(true, []);
  subscriptions: Subscription[] = [];

  constructor() {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  ngOnInit() {
    // console.log(this.incomeRecords$);
    if (!this.incomeRecords$) {
      this.incomeRecords$ = of([]);
    }
    this.dataSource = new IncomeRecordDataSource(this.incomeRecords$);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onSearchChanged(searchText: string) {
    this.dataSource.filter = searchText;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
