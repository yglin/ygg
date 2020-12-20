import { DataAccessor } from './data-accessor';
import { Emcee } from './emcee';
import { Entity } from './entity';

export class EntityFactory {
  constructor(protected dataAccessor: DataAccessor, protected emcee: Emcee) {}

  create(ctor: new (d: DataAccessor, e: Emcee) => Entity): Entity {
    return new ctor(this.dataAccessor, this.emcee);
  }
}
