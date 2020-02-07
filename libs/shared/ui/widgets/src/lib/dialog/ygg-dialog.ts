import { Type } from '@angular/core';
import { Observable } from 'rxjs';

export interface YggDialogContentComponent {
  dialogData: any;
  dialogSubmit$: Observable<any>;
}

export interface YggDialogComponentData {
  contentComponent: Type<any>;
  title?: string;
  data?: any;
}

