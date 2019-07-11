import { Injectable } from '@angular/core';
import { Entity } from './entity';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  cache: { [id: string]: any } = {};

  constructor() { }

  get(id: string): any {
    return this.cache[id];
  }

  add(item: Entity) {
    this.cache[item.id] = item;
  }

  delete(item: Entity) {
    delete this.cache[item.id];
  }

  has(id: string): boolean {
    return id in this.cache;
  }
}
