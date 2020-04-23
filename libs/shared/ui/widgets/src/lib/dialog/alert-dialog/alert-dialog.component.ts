import { Component, OnInit, Inject } from '@angular/core';
import { IAlertDialogInput } from './alert-dialog.component.po';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ygg-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: IAlertDialogInput,
    private dialogRef: MatDialogRef<AlertDialogComponent>
  ) {}

  ngOnInit(): void {}

  confirm() {
    this.dialogRef.close(true);
  }
}
