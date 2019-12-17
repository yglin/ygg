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
  @Input() formControl: AbstractControl;
  @Input() model: FormControlModel;
  @Input() name: string;
  @Input() label: string;
  // formControl: AbstractControl;
  formControlTypes = FormControlType;

  constructor() { }

  ngOnInit() {
    // console.log(this.model);
    this.name = this.name !== undefined ? this.name : this.model.name;
    this.label = this.label !== undefined ? this.label : this.model.label;
    this.formControl = !!(this.formControl) ? this.formControl : this.formGroup && this.formGroup.get(this.name);
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
