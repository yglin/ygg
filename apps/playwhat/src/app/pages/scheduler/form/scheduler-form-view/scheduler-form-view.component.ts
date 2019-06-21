import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleFormService, ScheduleForm } from 'libs/playwhat/scheduler/src/lib/schedule-form';

@Component({
  selector: 'pw-scheduler-form-view',
  templateUrl: './scheduler-form-view.component.html',
  styleUrls: ['./scheduler-form-view.component.css']
})
export class SchedulerFormViewComponent implements OnInit {
  scheduleForm: ScheduleForm;

  constructor(
    private route: ActivatedRoute,
    private scheduleFormService: ScheduleFormService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.scheduleFormService.get$(id).subscribe(form => this.scheduleForm = form);
    }
  }

}
