import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { ScheduleFormService } from './schedule-form.service';

@Component({
  selector: 'ygg-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  @Input() formGroup: FormGroup;
  budgetType = 'total';

  constructor(private scheudleFormService: ScheduleFormService) {
  }

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.scheudleFormService.createFormGroup();
    }
  }

  isError(controlName: string, errorName: string): boolean {
    const control = this.formGroup.get(controlName);
    return control.touched && control.hasError(errorName);
  }
}
