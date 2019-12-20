import { isEmpty, keys } from "lodash";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroupModel } from '../form-group';
import { FormGroup } from '@angular/forms';
import { FormFactoryService } from '../form-factory.service';
import { FormGroupValue } from '../form-group';
import { isRequired, FormControlModel } from '../form-control';

@Component({
  selector: 'ygg-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  @Input() model: FormGroupModel;
  @Input() value: FormGroupValue;
  @Output() submit: EventEmitter<any> = new EventEmitter();
  formGroup: FormGroup;
  controlModelNames: string[];

  constructor(
    private formFactory: FormFactoryService
  ) { }

  ngOnInit() {
    if (this.model) {
      this.formGroup = this.formFactory.buildGroup(this.model);
      if (!isEmpty(this.model.controlsOrder)) {
        this.controlModelNames = this.model.controlsOrder;
      } else {
        this.controlModelNames = keys(this.model.controls);
      }
      if (this.value) {
        this.formGroup.patchValue(this.value.clone());
      }
    }
  }

  onSubmit() {
    this.submit.emit(this.formGroup.value);
  }

  isRequired(model: FormControlModel): boolean {
    return isRequired(model);
  }
}
