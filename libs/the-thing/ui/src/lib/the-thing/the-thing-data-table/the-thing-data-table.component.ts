import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  TheThingImitation,
  TheThing,
  TheThingCellTypes,
  DataTableConfig,
  TheThingCellComparator
} from '@ygg/the-thing/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { keys, isEmpty, filter, pickBy, mapValues, get } from 'lodash';
import { TheThingDataSource } from './the-thing-datasource';
import { Router } from '@angular/router';

@Component({
  selector: 'the-thing-data-table',
  templateUrl: './the-thing-data-table.component.html',
  styleUrls: ['./the-thing-data-table.component.css']
})
export class TheThingDataTableComponent implements OnInit {
  @Input() imitation: TheThingImitation;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: TheThingDataSource;
  dataTableConfig: DataTableConfig;
  displayedColumns: string[] = ['name'];

  constructor(
    private theThingAccessService: TheThingAccessService,
    private router: Router
  ) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  ngOnInit() {
    if (this.imitation) {
      // console.dir(this.imitation);
      let compareFunctions: {
        [key: string]: TheThingCellComparator;
      } = this.imitation.getComparators();
      // if (!isEmpty(this.imitation.cellsDef)) {
      //   compareFunctions = pickBy(
      //     mapValues(this.imitation.cellsDef, cellType =>
      //       get(TheThingCellTypes, `${cellType}.comparator`, null)
      //     ),
      //     cf => typeof cf === 'function'
      //   );
      // }

      this.dataSource = new TheThingDataSource(
        this.theThingAccessService.listByFilter$(this.imitation.filter),
        compareFunctions
      );
      if (this.imitation.dataTableConfig) {
        this.dataTableConfig = this.imitation.dataTableConfig;
        this.displayedColumns = this.displayedColumns.concat(
          keys(this.dataTableConfig.columns)
        );
        this.displayedColumns.push('management');
      }
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

  async onDelete(theThing: TheThing) {
    if (confirm(`確定要永久刪除 ${theThing.name} ？`)) {
      try {
        await this.theThingAccessService.delete(theThing);
        alert(`已刪除 ${theThing.name}`);
      } catch (error) {
        alert(`刪除失敗，錯誤原因： ${error.message}`);
      }
    }
  }
}
