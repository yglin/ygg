import { Injectable, TemplateRef, Type } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { YggDialogComponentData } from './ygg-dialog';
import { YggDialogComponent } from './ygg-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { Subscription } from 'rxjs';
import { find } from 'lodash';
import { AlertType } from '@ygg/shared/infra/core';

export interface IYggDialogOpenConfig {
  title?: string;
  data?: any;
  panelClass?: string[];
}

@Injectable({ providedIn: 'root' })
export class YggDialogService {
  constructor(private dialog: MatDialog) {}

  open(
    component: Type<any>,
    config: IYggDialogOpenConfig = {}
  ): MatDialogRef<any> {
    // Get currently active dialog
    const dialogRefPreviousActive: MatDialogRef<any> = find<MatDialogRef<any>>(
      this.dialog.openDialogs,
      dialogRef => dialogRef.componentInstance.isActive
    );
    // Deactivate all opened dialogs
    for (const dialogRef of this.dialog.openDialogs) {
      dialogRef.componentInstance.isActive = false;
    }
    const wrappingData: YggDialogComponentData = {
      contentComponent: component,
      title: config.title,
      data: config.data
    };
    config.data = wrappingData;
    config.panelClass = ['ygg-dialog'];
    const newDialogRef = this.dialog.open(YggDialogComponent, config);
    // Activate new dialog
    newDialogRef.componentInstance.isActive = true;
    // Re-activate previous dialog after new one closed
    if (!!dialogRefPreviousActive) {
      newDialogRef
        .afterClosed()
        .subscribe(
          () => (dialogRefPreviousActive.componentInstance.isActive = true)
        );
    }
    return newDialogRef;
  }

  async confirm(content: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const confirmDialogRef = this.open(ConfirmDialogComponent, {
        title: '確認並繼續',
        data: {
          content
        }
      });
      confirmDialogRef.afterClosed().subscribe(isConfirmed => {
        if (!!isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async alert(content: string, type: AlertType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const alertDialogRef = this.open(AlertDialogComponent, {
        title: '訊息',
        data: {
          content,
          type
        }
      });
      alertDialogRef.afterClosed().subscribe(
        () => {
          resolve(true);
        },
        error => {
          console.error(error);
          reject(error);
        }
      );
    });
  }
}
