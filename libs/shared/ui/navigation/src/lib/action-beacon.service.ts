import { Injectable } from '@angular/core';
import { ActionBeacon } from '@ygg/shared/ui/core';
import { EmceeService } from '@ygg/shared/ui/widgets';

@Injectable({
  providedIn: 'root'
})
export class ActionBeaconService extends ActionBeacon {
  constructor(emcee: EmceeService) {
    super(emcee);
  }
}
