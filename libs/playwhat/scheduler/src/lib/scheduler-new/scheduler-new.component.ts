import { Component, OnInit } from '@angular/core';
import { SchedulePlan } from '@ygg/schedule/core';
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
      this.router.navigate(['scheduler', 'plans', form.id]);
    }
  }
}
