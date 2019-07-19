import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressSpinnerComponent } from './progress-spinner.component';

@Injectable({
  providedIn: 'root'
})
export class ProgressSpinnerService {
  dialogRef: MatDialogRef<ProgressSpinnerComponent>;
  callStack = 0;

  constructor( protected dialog: MatDialog) { }

  show() {
    this.callStack += 1;
    // XXX setTimeout() workaround for ExpressionChangedAfterItHasBeenCheckedError error
    // When trying to open a dialog in Angular lifecycle
    setTimeout(() => {
      if (!this.dialogRef) {
        this.dialogRef = this.dialog.open(ProgressSpinnerComponent, {
          panelClass: 'ygg-transparent-background',
          disableClose: true
        });
        // this.dialogRef.afterOpen().subscribe(() => console.log('Start Spin Spin!'));
      }
    }, 0);
  }

  hide(){
    this.callStack -= 1;
    setTimeout(() => {
        if (this.callStack <= 0 && this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = undefined;
      }
    }, 500);
  }
}
