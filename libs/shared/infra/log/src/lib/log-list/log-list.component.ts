import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { LogListDataSource, LogListItem } from './log-list-datasource';
import { LogService } from '../log.service';
import { DataSource } from '@angular/cdk/table';
import { LogLevel, getLogLevelName } from '../log';

@Component({
  selector: 'ygg-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css']
})
export class LogListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: LogListDataSource | any;

  constructor(private logService: LogService) {
    this.dataSource = new LogListDataSource(this.logService.logs$);
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['createAt', 'level', 'message'];

  ngAfterViewInit() {
    // console.log(this.paginator);
    this.dataSource.paginator = this.paginator;
    // console.log(this.sort);
    this.dataSource.sort = this.sort;
  }

  getLogLevelName(level: LogLevel): string {
    return getLogLevelName(level);
  }
}
