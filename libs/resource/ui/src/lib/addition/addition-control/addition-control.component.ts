import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Resource, Addition, ResourceType } from "@ygg/resource/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormGroupModel } from '@ygg/shared/ui/dynamic-form';
import { AdditionFactoryService, AdditionFormGroupModel } from "@ygg/resource/factory";

@Component({
  selector: 'ygg-addition-control',
  templateUrl: './addition-control.component.html',
  styleUrls: ['./addition-control.component.css']
})
export class AdditionControlComponent implements OnInit {
  @Input() addition: Addition;
  @Output() submit: EventEmitter<Resource> = new EventEmitter();
  additionFormModel: FormGroupModel;
  
  constructor(private additionFactory: AdditionFactoryService) {
    this.additionFormModel = AdditionFormGroupModel;
  }

  ngOnInit() {
    if (!this.addition) {
      this.addition = new Addition();
    }
  }

  onSubmit(value: any) {
    this.addition.fromJSON(value);
    this.submit.emit(this.addition);
  }
}
