import { Component, OnInit } from '@angular/core';
import { ScheduleForm } from '@ygg/shared/domain/schedule';
import { Router } from '@angular/router';

@Component({
  selector: 'ygg-scheduler-form-page',
  templateUrl: './scheduler-form-page.component.html',
  styleUrls: ['./scheduler-form-page.component.css']
})
export class SchedulerFormPageComponent implements OnInit {

  constructor(private router: Router) {
    console.log('SHIT');
  }

  ngOnInit() {
  }

  onSubmit(form: ScheduleForm) {
    console.log(form);
    if (ScheduleForm.isScheduleForm(form)) {
      this.router.navigate(['scheduler', 'forms', form.id]);
    }
  }
}
