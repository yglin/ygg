import { extend, sample } from 'lodash';
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/core';

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

  constructor(options: any = {}) {
    this.unformatted = 'Taiwan';
    if (Address.isAddress(options)) {
      extend(this, options);
    }
  }

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
    const address: any = sample([
      {
        country: '台灣',
        county: '南投縣',
        district: '南投市',
        unformatted: '中興新村大操場'
      }, {
        country: '台灣',
        county: '南投縣',
        district: '南投市',
        road: '光明一路',
        number: '60號',
      }, {
        country: '台灣',
        county: '南投縣',
        district: '南投市',
        road: '文獻路',
        number: '2號',
      }, {
        country: '台灣',
        county: '南投縣',
        district: '南投市',
        road: '中興路',
        number: '4號',
      }, {
        country: '台灣',
        county: '彰化縣',
        district: '彰化市',
        road: '溫泉路',
        number: '31號',
      }, {
        country: '台灣',
        county: '彰化縣',
        district: '彰化市',
        road: '南瑤路',
        number: '372號',
      }, {
        country: '台灣',
        county: '彰化縣',
        district: '彰化市',
        road: '三民路',
        number: '1號',
      }, {
        country: '台灣',
        county: '台北市',
        district: '中正區',
        road: '北平西路',
        number: '3號',
      }]);
    const newOne = new Address().fromJSON(address);
    return newOne;
  }

  static fromRaw(value: string) {
    return new Address().fromJSON({
      unformatted: value
    });
  }

  getFullAddress() {
    return `${this.country || ''}${this.county || ''}${this.city || ''}${this
      .district || ''}${this.road || ''}${this.section || ''}${this.number ||
      ''}${this.unformatted || ''}`;
  }

  fromJSON(data: any = {}): this {
    if (Address.isAddress(data)) {
      this.country = '';
      this.county = '';
      this.city = '';
      this.district = '';
      this.road = '';
      this.section = '';
      this.number = '';
      this.unformatted = '';
      extend(this, data);
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
