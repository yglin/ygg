import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormGroup, FormArray, FormControl} from '@angular/forms';

import {ScheduleFormService} from './schedule-form.service';
import { ScheduleForm } from './schedule-form';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Tags } from '@ygg/shared/infrastructure/utility-types';

@Component({
  selector: 'ygg-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  @Input() id: string;
  @Input() formGroup: FormGroup;
  @Output() onSubmit: EventEmitter<ScheduleForm>;
  likesSource$: Observable<Tags>;
  budgetType = 'total';
  needTranspotationHelp = false;
  needAccommodationHelp = false;

  constructor(private scheudleFormService: ScheduleFormService) {
    this.onSubmit = new EventEmitter();
    this.likesSource$ = this.scheudleFormService.listLikes$();
  }

  get contactsFormArray() {
    return this.formGroup.get('contacts') as FormArray;
  }

  addContact() {
    this.contactsFormArray.push(new FormControl());
  }

  deleteContact(index: number) {
    this.contactsFormArray.removeAt(index);
  }

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.scheudleFormService.createFormGroup();
    }
    if (this.id) {
      this.scheudleFormService.get$(this.id).pipe(
        first()
      ).subscribe(scheudleForm => {
        this.formGroup.patchValue(scheudleForm);
      });
    }
  }

  isError(controlName: string, errorName: string): boolean {
    const control = this.formGroup.get(controlName);
    return control.touched && control.hasError(errorName);
  }

  onSelectResources(resourceIds: string[]) {
    // this.selectedResourceIds$.next(resourceIds);
  }

  submit() {
    if(confirm('確定已填寫完畢，要送出需求嗎？')) {
      const scheduleForm = new ScheduleForm(this.formGroup.value);
      if (this.id) {
        scheduleForm.id = this.id;
      }
      this.scheudleFormService.upsert(scheduleForm).then(() => {
        alert('已成功更新／新增需求資料');
        this.onSubmit.emit(scheduleForm);
      });
    };
  }
}
