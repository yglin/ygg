import { wrapError } from '@ygg/shared/infra/error';
import { get, has, set } from 'lodash';
import { Subject } from 'rxjs';

export class OurboxHeadQuarter {
  beacon: Subject<any> = new Subject();
  reactions: any = {};

  constructor() {
    this.beacon.subscribe(event => {
      // console.dir(event);
      // console.dir(this.reactions);
      const reaction = get(this.reactions, event.name, null);
      if (reaction && typeof reaction === 'function') {
        reaction(event.data);
      } else {
        console.log(`Unregistered beacon event: ${event.name}`);
      }
    });
  }

  registerReaction(eventPath: string, reaction: Function) {
    try {
      if (has(this.reactions, eventPath)) {
        throw new Error(`Event ${eventPath} already registered with reaction`);
      }
      set(this.reactions, eventPath, reaction);
    } catch (error) {
      const wrpError = wrapError(
        error,
        `Failed to register reaction for event "${eventPath}"`
      );
      throw wrpError;
    }
  }

  emit(eventName: string, data: any) {
    this.beacon.next({
      name: eventName,
      data
    });
  }
}
