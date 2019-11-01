import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  AfterViewInit
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SchedulePlanTableDataSource } from './schedule-plan-table-datasource';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SchedulePlan } from '../schedule-plan';
import { Query } from '@ygg/shared/infra/data-access';
import { SchedulePlanService } from '../schedule-plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ygg-schedule-plan-table',
  templateUrl: './schedule-plan-table.component.html',
  styleUrls: ['./schedule-plan-table.component.css']
})
export class SchedulePlanTableComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Input() queries: Query[];
  source: BehaviorSubject<SchedulePlan[]> = new BehaviorSubject([]);
  dataSource: SchedulePlanTableDataSource = new SchedulePlanTableDataSource(
    this.source
  );
  subscriptions: Subscription[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['dateRange', 'numParticipants', 'contacts', 'agent'];

  constructor(
    private schedulePlanService: SchedulePlanService,
    private router: Router,
    // private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.queries = this.queries || [];
    this.subscriptions.push(
      this.schedulePlanService.find$(this.queries).subscribe(this.source)
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
    searchText = searchText || '';
    // console.dir(searchText);
    this.dataSource.filter = searchText.trim().toLowerCase();
  }

  gotoView(id: string) {
    this.router.navigate(['scheduler', 'forms', id]);
  }
}
