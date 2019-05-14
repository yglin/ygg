import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleForm, ScheduleFormService } from '@ygg/shared/domain/schedule';

@Component({
  selector: 'ygg-scheduler-form-view-page',
  templateUrl: './scheduler-form-view-page.component.html',
  styleUrls: ['./scheduler-form-view-page.component.css']
})
export class SchedulerFormViewPageComponent implements OnInit {
  scheduleForm: ScheduleForm;

  constructor(
    private route: ActivatedRoute,
    private scheduleFormService: ScheduleFormService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.scheduleFormService.get$(id).subscribe(scheduleForm => this.scheduleForm = scheduleForm);
    }
  }

}
