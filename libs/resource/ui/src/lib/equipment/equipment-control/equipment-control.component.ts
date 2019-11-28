import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Resource, Equipment, ResourceType } from "@ygg/resource/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormGroupModel } from '@ygg/shared/ui/dynamic-form';
import { EquipmentFactoryService, EquipmentFormGroupModel } from "@ygg/resource/factory";

@Component({
  selector: 'ygg-equipment-control',
  templateUrl: './equipment-control.component.html',
  styleUrls: ['./equipment-control.component.css']
})
export class EquipmentControlComponent implements OnInit {
  @Input() equipment: Equipment;
  @Output() submit: EventEmitter<Resource> = new EventEmitter();
  equipmentFormModel: FormGroupModel;
  
  constructor(private equipmentFactory: EquipmentFactoryService) {
    this.equipmentFormModel = EquipmentFormGroupModel;
  }

  ngOnInit() {
    if (!this.equipment) {
      this.equipment = new Equipment();
    }
  }

  onSubmit(value: any) {
    this.equipment.fromJSON(value);
    this.submit.emit(this.equipment);
  }
}
