import { Emcee, AlertType } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';

export class EmceeFunctions extends Emcee {
  async alert(message: string, type: AlertType) {
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  async confirm(message: string): Promise<boolean> {
    // In server-side, no user confirm
    return true;
  }

  showProgress(options?: {
    message: string;
    percentage$: Observable<number>;
  }): void {
    // Basically do nothing in firebase functions
    console.log(`Progress ${options && options.message} ...`);
  }

  hideProgress(): void {
    // Basically do nothing in firebase functions
    console.log(`Progress done`);
  }
}
