import {Injectable, TemplateRef, Type} from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { YggDialogComponent, YggDialogComponentData } from './ygg-dialog.component';

export interface YggDialogContentComponent {
  dialogData: any;
}

@Injectable({providedIn: 'root'})
export class YggDialogService {
  constructor(private dialog: MatDialog) {}

  open(component: Type<any>, config: any = {}) {
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
