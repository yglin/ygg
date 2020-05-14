import { Injectable } from '@angular/core';
import { Emcee, AlertType } from '@ygg/shared/infra/core';
import { YggDialogService } from './dialog';

@Injectable({
  providedIn: 'root'
})
export class EmceeService extends Emcee {
  constructor(private dialog: YggDialogService) {
    super();
  }

  async alert(message: string, type: AlertType) {
    return this.dialog.alert(message);
  }

  async confirm(message: string): Promise<boolean> {
    return this.dialog.confirm(message);
  }

  showProgress(message: string, percentage: number): void {
    throw new Error('Method not implemented.');
  }

  hideProgress(delay: number): void {
    throw new Error('Method not implemented.');
  }
}
