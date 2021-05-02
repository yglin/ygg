import { extend, remove, sumBy, values } from 'lodash';

export class TagRecords {
  static collection = 'tagRecords';

  id: string;
  records: { [colleciton: string]: string[] };

  constructor(tag: string) {
    this.id = tag;
    this.records = {};
  }

  get amount(): number {
    return sumBy(values(this.records), collection => collection.length);
  }

  addRecord(collection: string, id: string) {
    if (!(collection in this.records)) {
      this.records[collection] = [];
    }
    if (!this.records[collection].includes(id)) {
      this.records[collection].push(id);
    }
  }

  removeRecord(collection: string, id: string) {
    if (!(collection in this.records)) {
      this.records[collection] = [];
    }
    remove(this.records[collection], _id => _id === id);
  }

  toJSON(): any {
    return {
      id: this.id,
      records: this.records
    };
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }
}
