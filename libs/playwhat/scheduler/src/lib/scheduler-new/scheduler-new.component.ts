import { Component, OnInit } from '@angular/core';
import { SchedulePlan } from '../schedule-plan/schedule-plan';
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

  onSubmitForm(form: SchedulePlan) {
    if (form && form.id) {
      this.router.navigate(['scheduler', 'forms', form.id]);
    }
  }
}
