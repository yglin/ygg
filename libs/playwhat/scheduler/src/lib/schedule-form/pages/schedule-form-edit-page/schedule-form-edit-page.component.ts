import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ScheduleForm } from '../../schedule-form';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ygg-schedule-form-edit-page',
  templateUrl: './schedule-form-edit-page.component.html',
  styleUrls: ['./schedule-form-edit-page.component.css']
})
export class ScheduleFormEditPageComponent implements OnInit, OnDestroy {
  @Input() scheduleForm: ScheduleForm;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    if (this.route.data) {
      this.subscriptions.push(
        this.route.data.pipe(take(1)).subscribe(data => {
          if (data && data.scheduleForm) {
            this.scheduleForm = data.scheduleForm;
          } else {
            this.scheduleForm = new ScheduleForm();
          }
        })
      );
    } else {
      this.scheduleForm = new ScheduleForm();
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onChangeForm(scheduleForm: ScheduleForm) {
    // console.log(scheduleForm);
    this.scheduleForm = scheduleForm;
  }

  onSubmitForm(scheduleForm: ScheduleForm) {
    if (scheduleForm && scheduleForm.id) {
      this.router.navigate(['/', 'scheduler', 'forms', scheduleForm.id]);
    }
  }
}
