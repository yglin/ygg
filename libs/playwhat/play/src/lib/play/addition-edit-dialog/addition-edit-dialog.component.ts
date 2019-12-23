import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Addition } from '@ygg/resource/core';

@Component({
  selector: 'ygg-addition-edit-dialog',
  templateUrl: './addition-edit-dialog.component.html',
  styleUrls: ['./addition-edit-dialog.component.css']
})
export class AdditionEditDialogComponent implements OnInit {
  addition: Addition;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<AdditionEditDialogComponent>
  ) {}

  ngOnInit() {
    if (this.dialogData && this.dialogData.addition) {
      this.addition = (this.dialogData.addition as Addition).clone();
    }
  }

  onSubmit(addition: Addition) {
    this.dialogRef.close(addition);
  }
}
