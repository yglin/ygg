import { Observable } from 'rxjs';

export enum AlertType {
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}

export abstract class Emcee {
  async info(message: string) {
    return this.alert(message, AlertType.Info);
  }

  async error(message: string) {
    return this.alert(message, AlertType.Error);
  }

  async warning(message: string) {
    return this.alert(message, AlertType.Warning);
  }

  abstract alert(message: string, type: AlertType);
  abstract confirm(message: string): Promise<boolean>;
  abstract showProgress(options?:{message: string, percentage$?: Observable<number>}): void;
  abstract hideProgress(): void;

}

// export class EmceeSilly extends Emcee {
//   async alert(message: string, type: AlertType) {
//     alert(message);
//   }

//   async confirm(message: string): Promise<boolean> {
//     return new Promise((resolve, reject) => {
//       if (confirm(message)) {
//         resolve();
//       } else {
//         reject();
//       }
//     });
//   }

//   showProgress(message: string, percentage: number): void {
//     window.status = `${message}, ${percentage}%`;
//   }

//   hideProgress(delay: number = 1000): void {
//     setTimeout(() => {
//       window.status = `Done with the winds...`;
//     }, delay);
//   }
// }
