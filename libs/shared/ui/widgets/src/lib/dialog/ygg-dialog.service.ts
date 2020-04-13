import { Injectable, TemplateRef, Type } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { YggDialogComponentData } from './ygg-dialog';
import { YggDialogComponent } from './ygg-dialog.component';

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
}
