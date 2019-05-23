import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface DialogSampleContentComponentData {
  message: string;
}

@Component({
  selector: 'ygg-sample-content',
  templateUrl: './sample-content.component.html',
  styleUrls: ['./sample-content.component.css']
})
export class DialogSampleContentComponent implements OnInit { 
  dialogData: any;
  message: string;

  constructor(
    private dialogRef: MatDialogRef<DialogSampleContentComponent>
  ) { }

  ngOnInit() {
    if (this.dialogData && this.dialogData.message) {
      this.message = this.dialogData.message;
    }
  }

}
