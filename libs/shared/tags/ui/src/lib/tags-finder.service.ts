import { Injectable } from '@angular/core';
import { TagsFinder } from '@ygg/shared/tags/core';

@Injectable({
  providedIn: 'root'
})
export class TagsFinderService extends TagsFinder {
  constructor() {
    super();
  }
}
