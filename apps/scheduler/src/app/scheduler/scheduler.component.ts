import { isEmpty } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Schedule, ScheduleService, ScheduleForm } from '@ygg/shared/domain/schedule';
import { ScheduleFormService } from '@ygg/shared/domain/schedule';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ygg-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  scheduleForm: ScheduleForm;
  scheduleForm$: BehaviorSubject<ScheduleForm>;
  scheduleFormGroup: FormGroup;

  selectedResourceIds$: BehaviorSubject<string[]>;
  hasResourceSelected: boolean;

  scheduleSelect$: BehaviorSubject<Schedule>;

  constructor(
    private scheduleFormService: ScheduleFormService,
    private scheduleService: ScheduleService
  ) {
    this.scheduleForm = new ScheduleForm();
    this.scheduleFormGroup = this.scheduleFormService.createFormGroup();
    this.scheduleForm$ = new BehaviorSubject(this.scheduleForm);
    this.scheduleFormGroup.valueChanges.subscribe(values => {
      this.scheduleForm.fromJSON(values);
      this.scheduleForm$.next(this.scheduleForm);
    });

    this.selectedResourceIds$ = new BehaviorSubject<string[]>([]);
    this.hasResourceSelected = false;
    this.selectedResourceIds$.subscribe(resourceIds => this.hasResourceSelected = !isEmpty(resourceIds));

    this.scheduleSelect$ = new BehaviorSubject<Schedule>(null);
  }

  ngOnInit() {
  }

  onSelectAutoScheudle(schedule: Schedule) {
    console.log(schedule);
    this.scheduleSelect$.next(schedule);
  }

  onSelectResources(resourceIds: string[]) {
    this.selectedResourceIds$.next(resourceIds);
  }
}
