import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormArray, FormControl} from '@angular/forms';

import {ScheduleFormService} from './schedule-form.service';

@Component({
  selector: 'ygg-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  @Input() formGroup: FormGroup;
  budgetType = 'total';
  needTranspotationHelp = false;

  get contactsFormArray() {
    return this.formGroup.get('contacts') as FormArray;
  }

  addContact() {
    this.contactsFormArray.push(new FormControl());
  }

  deleteContact(index: number) {
    this.contactsFormArray.removeAt(index);
  }

  constructor(private scheudleFormService: ScheduleFormService) {}

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
