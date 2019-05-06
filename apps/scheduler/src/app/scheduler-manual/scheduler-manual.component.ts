import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Schedule, EventService, ScheduleService } from '@ygg/shared/domain/schedule';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ygg-scheduler-manual',
  templateUrl: './scheduler-manual.component.html',
  styleUrls: ['./scheduler-manual.component.css']
})
export class SchedulerManualComponent implements OnInit, OnDestroy {
  @Input() schedule$: Observable<Schedule>;
  schedule: Schedule;
  subscription: Subscription;

  constructor(
    private scheduleService: ScheduleService
  ) { }

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

  onDropEvent(dragDrop: CdkDragDrop<any>) {
    // console.log(`Switch events ${dragDrop.previousIndex} and ${dragDrop.currentIndex}`);
    const indexA = dragDrop.previousIndex;
    const indexB = dragDrop.currentIndex;
    // Swap their positions in events array;
    moveItemInArray(this.schedule.events, indexA, indexB);
    this.scheduleService.rearrangeKeepOrder(this.schedule);
  }
}
