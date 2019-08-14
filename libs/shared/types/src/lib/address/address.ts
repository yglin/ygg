import { extend } from 'lodash';
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';

export class Address implements SerializableJSON {
  private country?: string;
  private county?: string;
  private city?: string;
  private district?: string;
  private road?: string;
  private section?: string;
  private number?: string;
  private postal?: string;
  private unformatted: string;

  static isAddress(value: any): value is Address {
    return !!(
      value &&
      (value.unformatted ||
        value.country ||
        value.county ||
        value.city ||
        value.district ||
        value.road ||
        value.section ||
        value.number)
    );
  }

  static forge() {
    const newOne = new Address().fromJSON({
      country: '台灣',
      county: '南投縣',
      district: '南投市',
      road: '光明二路',
      number: '84號',
      unformatted: ''
    });
    return newOne;
  }

  static fromRaw(value: string) {
    return new Address().fromJSON({
      unformatted: value
    });
  }

  constructor() {}

  getFullAddress() {
    return `${this.country || ''}${this.county || ''}${this.city || ''}${this
      .district || ''}${this.road || ''}${this.section || ''}${this.number ||
      ''}${this.unformatted || ''}`;
  }

  fromJSON(data: any = {}): this {
    if (Address.isAddress(data)) {
      extend(this, data);
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
