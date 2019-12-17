import { cloneDeep } from "lodash";
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormControlModel } from "../form-control";
import { FormFactoryService } from "../form-factory.service";

@Component({
  selector: 'ygg-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.css']
})
export class FormArrayComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() model: FormControlModel;
  formArray: FormArray;

  constructor(private formFactory: FormFactoryService) { }

  ngOnInit() {
    if (this.formGroup && this.model) {
      this.formArray = this.formGroup.get(this.model.name) as FormArray;
    }
  }

  delete(index: number) {
    this.formArray.removeAt(index);
  }

  clearAll() {
    this.formArray.clear();
  }

  add() {
    const subModel = cloneDeep(this.model);
    subModel.isArray = false
    this.formArray.push(this.formFactory.buildControl(subModel));
  }
}
