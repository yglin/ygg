import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Resource, Equipment, ResourceType } from "@ygg/resource/core";
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'ygg-resource-control',
  templateUrl: './resource-control.component.html',
  styleUrls: ['./resource-control.component.css']
})
export class ResourceControlComponent implements OnInit {
  @Input() type: ResourceType;
  formGroup: FormGroup;
  
  @Output() submit: EventEmitter<Resource> = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit() {
  }

  onSubmit() {
    this.submit.emit(Equipment.forge());
  }
}
