import { Component, OnInit, Inject } from '@angular/core';
import { YggDialogContentComponent } from '../ygg-dialog';
import { Observable, Subject } from 'rxjs';
import { IConfirmDialogInput } from './confirm-dialog.component.po';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ygg-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: IConfirmDialogInput,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
