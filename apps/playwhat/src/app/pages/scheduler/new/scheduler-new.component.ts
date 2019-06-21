import { Component, OnInit } from '@angular/core';
import { ScheduleForm } from 'libs/playwhat/scheduler/src/lib/schedule-form';
import { Router } from '@angular/router';

@Component({
  selector: 'pw-scheduler-new',
  templateUrl: './scheduler-new.component.html',
  styleUrls: ['./scheduler-new.component.css']
})
export class SchedulerNewComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmitForm(form: ScheduleForm) {
    if (form && form.id) {
      this.router.navigate(['scheduler', 'forms', form.id]);
    }
  }
}
