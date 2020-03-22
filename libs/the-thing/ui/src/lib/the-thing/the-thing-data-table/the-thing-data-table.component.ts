import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  TheThingImitation,
  TheThing,
  TheThingCellTypes,
  DataTableConfig,
  TheThingCellComparator,
  TheThingFilter
} from '@ygg/the-thing/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import {
  keys,
  isEmpty,
  filter,
  pickBy,
  mapValues,
  get,
  isArray,
  find
} from 'lodash';
import { TheThingDataSource } from './the-thing-datasource';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'the-thing-data-table',
  templateUrl: './the-thing-data-table.component.html',
  styleUrls: ['./the-thing-data-table.component.css']
})
export class TheThingDataTableComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() imitation: TheThingImitation;
  @Input() theThings$: Observable<TheThing[]>;
  @Input() selection: TheThing[];
  @Output() selectionChange: EventEmitter<TheThing[]> = new EventEmitter();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: TheThingDataSource;
  dataTableConfig: DataTableConfig;
  displayedColumnsHead: string[] = ['name'];
  displayedColumnsTail: string[] = ['management'];
  displayedColumns: string[] = [];
  selectionModel: SelectionModel<TheThing> = new SelectionModel(true, []);
  subscriptions: Subscription[] = [];

  constructor(
    private theThingAccessService: TheThingAccessService,
    private router: Router
  ) {
    this.subscriptions.push(
      this.selectionModel.changed.subscribe(change => {
        this.selectionChange.emit(this.selectionModel.selected);
      })
    );
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  ngOnInit() {
    if (this.selectionChange.observers.length > 0) {
      this.displayedColumnsHead.unshift('select');
    }
    if (!this.theThings$) {
      this.theThings$ = this.theThingAccessService.list$();
    }

    this.subscriptions.push(
      this.theThings$.subscribe(things => {
        this.selectionModel.clear();
      })
    );

    let imitationColumns: string[] = [];
    if (this.imitation) {
      const compareFunctions: {
        [key: string]: TheThingCellComparator;
      } = this.imitation.getComparators();

      this.dataSource = new TheThingDataSource(
        this.theThings$,
        compareFunctions
      );

      if (this.imitation.dataTableConfig) {
        this.dataTableConfig = this.imitation.dataTableConfig;
        imitationColumns = keys(this.dataTableConfig.columns);
        // this.displayedColumns.push('management');
      }
    }

    this.displayedColumns = this.displayedColumnsHead
      .concat(imitationColumns)
      .concat(this.displayedColumnsTail);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.selection) {
      const prevSelection = changes.selection.previousValue;
      const curSelection = changes.selection.currentValue;
      if (isArray(curSelection) && curSelection !== prevSelection) {
        this.selectionModel.clear();
        for (const selected of curSelection) {
          if (find(this.dataSource.data, thing => thing.id === selected.id)) {
            this.selectionModel.select(selected);
          }
        }
      }
    }
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
    // console.log(this.paginator);
    this.dataSource.paginator = this.paginator;
    // console.log(this.sort);
    this.dataSource.sort = this.sort;
  }

  onClickTheThing(theThing: TheThing) {
    this.router.navigate(['/', 'the-things', theThing.id]);
  }

  selectAll() {
    this.dataSource.data.forEach(theThing =>
      this.selectionModel.select(theThing)
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectionModel.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selectionModel. */
  masterToggle() {
    this.isAllSelected()
      ? this.selectionModel.clear()
      : this.dataSource.data.forEach(theThing =>
          this.selectionModel.select(theThing)
        );
  }

  onGotoEdit(theThing: TheThing) {
    const queryParams = {};
    if (this.imitation) {
      queryParams['imitation'] = this.imitation.id;
    }
    this.router.navigate(['/', 'the-things', theThing.id, 'edit'], {
      queryParams
    });
  }

  // async onDelete(theThing: TheThing) {
  //   if (confirm(`確定要永久刪除 ${theThing.name} ？`)) {
  //     try {
  //       await this.theThingAccessService.delete(theThing);
  //       alert(`已刪除 ${theThing.name}`);
  //     } catch (error) {
  //       alert(`刪除失敗，錯誤原因： ${error.message}`);
  //     }
  //   }
  // }
}
