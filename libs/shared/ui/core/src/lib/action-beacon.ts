import { Action } from './action';
import { Subject } from 'rxjs';
import { Emcee } from '@ygg/shared/infra/core';

export class ActionBeacon {
  actions: { [id: string]: Action } = {};
  beacon: Subject<Action> = new Subject();

  constructor(protected emcee: Emcee) {}

  register(action: Action) {
    this.actions[action.id] = action;
  }

  run(actionId: string) {
    if (!(actionId in this.actions)) {
      this.emcee.error(`Action ${actionId} not register yet`);
    }
    this.beacon.next(this.actions[actionId]);
  }
}
