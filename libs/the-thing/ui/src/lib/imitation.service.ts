import { get } from "lodash";
import { Injectable } from '@angular/core';
import { TheThingImitation } from "@ygg/the-thing/core";

@Injectable({
  providedIn: 'root'
})
export class ImitationService {
  imitations: { [id: string]: TheThingImitation } = {};

  constructor() { }

  get(id : string): TheThingImitation {
    return get(this.imitations, id, null);
  }

  add(imitation: TheThingImitation) {
    if (imitation.id in this.imitations) {
      throw new Error(`Imitation "${imitation.id}" already in global imitations`);
    }
    this.imitations[imitation.id] = imitation;
  }
}
