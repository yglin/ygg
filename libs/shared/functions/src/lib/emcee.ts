import { Emcee, AlertType } from '@ygg/shared/infra/core';

export class EmceeFunctions extends Emcee {
  async alert(message: string, type: AlertType) {
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  async confirm(message: string): Promise<boolean> {
    // In server-side, no user confirm
    return true;
  }

  showProgress(message: string, percentage: number): void {
    console.log(`${message} ...${percentage}%`);
  }

  hideProgress(delay: number): void {
    // Do nothing...
  }
}
