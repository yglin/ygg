import { Component, OnInit, Input } from '@angular/core';
import { FormControlType, FormControlModel } from './form-control-model';
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
    // console.log(this.model);
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
