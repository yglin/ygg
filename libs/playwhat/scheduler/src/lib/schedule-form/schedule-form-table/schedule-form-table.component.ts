import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  AfterViewInit
} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ScheduleFormTableDataSource } from './schedule-form-table-datasource';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ScheduleForm } from '../schedule-form';
import { Query } from '@ygg/shared/infra/data-access';
import { ScheduleFormService } from '../schedule-form.service';

@Component({
  selector: 'ygg-schedule-form-table',
  templateUrl: './schedule-form-table.component.html',
  styleUrls: ['./schedule-form-table.component.css']
})
export class ScheduleFormTableComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() queries: Query[];
  source: BehaviorSubject<ScheduleForm[]> = new BehaviorSubject([]);
  dataSource: ScheduleFormTableDataSource = new ScheduleFormTableDataSource(
    this.source
  );
  subscriptions: Subscription[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['dateRange', 'numParticipants', 'contacts', 'agent'];

  constructor(private scheduleFormService: ScheduleFormService) {}
  ngOnInit() {
    this.queries = this.queries || [];
    this.subscriptions.push(
      this.scheduleFormService.find$(this.queries).subscribe(this.source)
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onChangeSearchText(searchText: string) {
    this.dataSource.filter = searchText.trim().toLowerCase();
  }
}
