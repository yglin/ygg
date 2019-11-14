import { SerializableJSON } from '@ygg/shared/infra/data-access';

export class TimeRange implements SerializableJSON {
  start: Date;
  end: Date;

  fromJSON(data: any): this {
    this.start = new Date(data.start);
    this.end = new Date(data.end);
    return this;
  }

  toJSON(): any {
    return {
      start: this.start.toISOString(),
      end: this.end.toISOString()
    }
  }
}