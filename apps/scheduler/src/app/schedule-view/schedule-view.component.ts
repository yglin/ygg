import { Component, OnInit, Input } from '@angular/core';
import { ScheduleService, Schedule } from '@ygg/shared/domain/schedule';

@Component({
  selector: 'ygg-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.css']
})
export class ScheduleViewComponent implements OnInit {
  @Input() id: string;
  schedule: Schedule;

  constructor(
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.scheduleService.get$(this.id).subscribe(schedule => this.schedule = schedule);
    }
  }

}
