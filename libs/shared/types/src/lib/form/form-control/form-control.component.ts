import { Component, OnInit, Input } from '@angular/core';
import { FormControlModel, FormControlType } from '../form';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'ygg-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.css']
})
export class FormControlComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() model: FormControlModel;
  formControl: AbstractControl;
  formControlTypes = FormControlType;

  constructor() { }

  ngOnInit() {
    this.formControl = this.formGroup.get(this.model.name);
  }

  getErrorMessage(errorName): string {
    for (const validator of this.model.validators) {
      if (validator.type === errorName) {
        return validator.errorMessage;
      }
    }
    return '';
  }

}
