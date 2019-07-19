import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';

export interface DialogSampleContentComponentData {
  message: string;
}

@Component({
  selector: 'ygg-sample-content',
  templateUrl: './sample-content.component.html',
  styleUrls: ['./sample-content.component.css']
})
export class DialogSampleContentComponent implements OnInit, YggDialogContentComponent { 
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
