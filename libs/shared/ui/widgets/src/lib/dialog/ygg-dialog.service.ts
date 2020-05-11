import { Injectable, TemplateRef, Type } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { YggDialogComponentData } from './ygg-dialog';
import { YggDialogComponent } from './ygg-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';

export interface IYggDialogOpenConfig {
  title?: string;
  data?: any;
  panelClass?: string[];
}

@Injectable({ providedIn: 'root' })
export class YggDialogService {
  constructor(private dialog: MatDialog) {}

  open(component: Type<any>, config: IYggDialogOpenConfig = {}) {
    const wrappingData: YggDialogComponentData = {
      contentComponent: component,
      title: config.title,
      data: config.data
    };
    config.data = wrappingData;
    config.panelClass = ['ygg-dialog'];
    return this.dialog.open(YggDialogComponent, config);
  }

  async confirm(content: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          content
        }
      });
      confirmDialogRef.afterClosed().subscribe(isConfirmed => {
        if (isConfirmed) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  async alert(content: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const alertDialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          content
        }
      });
      alertDialogRef.afterClosed().subscribe(
        () => {
          resolve();
        },
        error => {
          console.error(error);
          reject(error);
        }
      );
    });
  }
}
