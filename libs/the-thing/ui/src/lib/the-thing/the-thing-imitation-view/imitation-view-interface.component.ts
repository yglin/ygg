import { TheThing } from '@ygg/the-thing/core';
import { Observable } from 'rxjs';

export interface TheThingImitationViewInterface {
  theThing$: Observable<TheThing>;
}
