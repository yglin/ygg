import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Schedule } from '@ygg/shared/domain/schedule';

@Component({
  selector: 'ygg-scheduler-manual',
  templateUrl: './scheduler-manual.component.html',
  styleUrls: ['./scheduler-manual.component.css']
})
export class SchedulerManualComponent implements OnInit, OnDestroy {
  @Input() schedule$: Observable<Schedule>;
  schedule: Schedule;
  subscription: Subscription;

  constructor() { }

  ngOnInit() {
    if (this.schedule$) {
      this.subscription = this.schedule$.subscribe(schedule => {
        console.log(schedule);
        this.schedule = schedule;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
