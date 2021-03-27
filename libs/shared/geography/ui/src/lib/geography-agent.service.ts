import { Injectable } from '@angular/core';
import { GeographyAgent, Location } from '@ygg/shared/geography/core';
import { wrapError } from '@ygg/shared/infra/error';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { LocationControlComponent } from './location';

@Injectable({
  providedIn: 'root'
})
export class GeographyAgentService extends GeographyAgent {
  constructor(private dialog: YggDialogService) {
    super();
  }

  async userInputLocation(options: any = {}): Promise<Location> {
    try {
      const dialogRef = this.dialog.open(LocationControlComponent, {
        title: options.title || `請輸入一個地點`,
        data: options.location
      });
      return dialogRef.afterClosed().toPromise();
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to get user input location`);
      return Promise.reject(wrpErr);
    }
  }
}
