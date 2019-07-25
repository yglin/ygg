import { Component, OnInit, Input } from '@angular/core';
import { FormControlModel } from '../form';
import { FormGroup } from '@angular/forms';
import { DynamicInputModel, DynamicInputModelConfig } from '@ng-dynamic-forms/core';

@Component({
  selector: 'ygg-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.css']
})
export class FormControlComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() model: FormControlModel;
  dynamicInputModel: DynamicInputModel;

  constructor() { }

  ngOnInit() {
    this.dynamicInputModel = this.toDynamicInputModel(this.model);
  }

  toDynamicInputModel(controlModel: FormControlModel): DynamicInputModel {
    const config: DynamicInputModelConfig = {
      id: controlModel.name,
      label: controlModel.label,
      validators: {},
      errorMessages: {}
    };
    for (const validator of controlModel.validators) {
      if (validator.type === 'required') {
        config.validators['required'] = null;
        config.errorMessages['required'] = `請填入${controlModel.label}`;
      }
    }

    return new DynamicInputModel(config);
  }

}
