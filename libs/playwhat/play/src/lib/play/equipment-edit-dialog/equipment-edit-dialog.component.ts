import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Equipment } from '@ygg/resource/core';

@Component({
  selector: 'ygg-equipment-edit-dialog',
  templateUrl: './equipment-edit-dialog.component.html',
  styleUrls: ['./equipment-edit-dialog.component.css']
})
export class EquipmentEditDialogComponent implements OnInit {
  equipment: Equipment;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<EquipmentEditDialogComponent>
  ) {}

  ngOnInit() {
    if (this.dialogData && this.dialogData.equipment) {
      this.equipment = (this.dialogData.equipment as Equipment).clone();
    }
  }

  onSubmit(equipment: Equipment) {
    this.dialogRef.close(equipment);
  }
}
