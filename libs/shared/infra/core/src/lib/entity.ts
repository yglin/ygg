import { extend, omit } from 'lodash';
import * as short from 'short-uuid';
import { DataAccessor } from './data-accessor';
import { Emcee } from './emcee';
import { wrapError } from '@ygg/shared/infra/error';

export type SerializerJSON = (data: any) => any;
export type DeserializerJSON = (data: any) => any;

export class Entity {
  collection: string;
  id: string;

  /** Owner's user id */
  ownerId: string;

  /** Display name */
  name: string;

  /** Create time */
  createAt: number;

  /** Last modified time */
  modifyAt: number;

  [key: string]: any;

  static isEntity(value: any): value is Entity {
    return value && value.id;
  }

  constructor(protected dataAccessor: DataAccessor, protected emcee: Emcee) {
    this.collection = 'garbages';
    this.id = generateID();
    this.name = '';
    this.createAt = new Date().valueOf();
    this.modifyAt = this.createAt;
  }

  async load() {
    try {
      const data = await this.dataAccessor.load(this.collection, this.id);
      this.fromJSON(data);
    } catch (error) {
      const wrpError = wrapError(
        error,
        `Failed to load ${this.collection}/${this.id}`
      );
      this.emcee.error(wrpError.message);
      return Promise.reject(wrpError);
    }
  }

  async save() {
    try {
      await this.dataAccessor.save(this.collection, this.id, this.toJSON());
    } catch (error) {
      const wrpError = wrapError(
        error,
        `Failed to save ${this.collection}/${this.id}`
      );
      this.emcee.error(wrpError.message);
      return Promise.reject(wrpError);
    }
  }

  toJSON(): any {
    return JSON.parse(JSON.stringify(this));
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }
}

export function generateID(): string {
  return short().generate();
}
