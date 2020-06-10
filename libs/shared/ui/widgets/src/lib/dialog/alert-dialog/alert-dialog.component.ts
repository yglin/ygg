import { Component, OnInit, Inject } from '@angular/core';
import { IAlertDialogInput } from './alert-dialog.component.po';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { YggDialogContentComponent } from '../ygg-dialog';
import { Observable, of } from 'rxjs';
import { AlertType } from '@ygg/shared/infra/core';

@Component({
  selector: 'ygg-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit, YggDialogContentComponent {
  iconClass: string;
  typeIcon = 'info';
  dialogData: any;
  dialogOutput$: Observable<any> = of(true);

  constructor() {}

  ngOnInit(): void {
    const alertType: AlertType = this.dialogData.type || AlertType.Info;

    switch (alertType) {
      case AlertType.Error:
        this.typeIcon = 'error';
        this.iconClass = 'error';
        break;

      case AlertType.Warning:
        this.typeIcon = 'warning';
        this.iconClass = 'warning';
        break;

      default:
        this.typeIcon = 'info';
        this.iconClass = 'info';
        break;
    }
  }

  // confirm() {
  //   this.dialogRef.close(true);
  // }
}
