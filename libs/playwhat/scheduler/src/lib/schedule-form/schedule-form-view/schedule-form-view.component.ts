import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ScheduleForm } from '../schedule-form';
import { ActivatedRoute } from '@angular/router';
import { ScheduleFormService } from '../schedule-form.service';
import { Subscription } from 'rxjs';
import { TranspotationTypes } from "../transpotation";

@Component({
  selector: 'ygg-schedule-form-view',
  templateUrl: './schedule-form-view.component.html',
  styleUrls: ['./schedule-form-view.component.css']
})
export class ScheduleFormViewComponent implements OnInit, OnDestroy {
  @Input() scheduleForm: ScheduleForm;
  subscriptions: Subscription[] = [];
  transpotationTypes = TranspotationTypes;

  constructor(
    private route: ActivatedRoute,
    private scheduleFormService: ScheduleFormService
  ) {}

  ngOnInit() {
    if (!this.scheduleForm) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.subscriptions.push(
          this.scheduleFormService
            .get$(id)
            .subscribe(scheduleForm => (this.scheduleForm = scheduleForm))
        );
      }
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
