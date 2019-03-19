import * as _ from 'lodash';
import * as moment from 'moment';
import * as crypto from 'crypto-js';
import { Payment } from '@ygg/shared/interfaces';
import { EcpayPaymentMethod, EcpayOrderParams, EcpayConfig } from './ecpay';

export class EcpayOrder implements EcpayOrderParams {
  config: EcpayConfig;

  _MerchantID: string;
  set MerchantID(value: string) {
    if (value.length <= 10) {
      this._MerchantID = value;
    } else {
      console.error('Length of MerchantID must <= 10');
    }
  }

  get MerchantID(): string {
    return this._MerchantID;
  }

  _MerchantTradeNo: string;
  set MerchantTradeNo(value: string) {
    if (value.length <= 20) {
      this._MerchantTradeNo = value;
    } else {
      console.error('Length of MerchantTradeNo must <= 20');
    }
  }

  get MerchantTradeNo(): string {
    return this._MerchantTradeNo;
  }

  MerchantTradeDate: string;
  PaymentType = 'aio';
  TotalAmount: number;

  _TradeDesc: string;
  set TradeDesc(value: string) {
    if (value.length <= 200) {
      this._TradeDesc = value;
    } else {
      console.error('Length of TradeDesc must <= 200');
    }
  }

  get TradeDesc(): string {
    return this._TradeDesc;
  }

  _ItemName: string;
  set ItemName(value: string) {
    if (value.length <= 200) {
      this._ItemName = value;
    } else {
      console.error('Length of ItemName must <= 200');
    }
  }

  get ItemName(): string {
    return this._ItemName;
  }

  _ReturnURL: string;
  set ReturnURL(value: string) {
    if (value.length <= 200) {
      this._ReturnURL = value;
    } else {
      console.error('Length of ReturnURL must <= 200');
    }
  }

  get ReturnURL(): string {
    return this._ReturnURL;
  }

  ChoosePayment = EcpayPaymentMethod.ALL;

  _CheckMacValue: string;
  set CheckMacValue(value: string) {
    if (value.length <= 200) {
      this._CheckMacValue = value;
    } else {
      console.error('Length of CheckMacValue must <= 200');
    }
  }

  get CheckMacValue(): string {
    return this._CheckMacValue;
  }

  EncryptType = 1;

  /** Store local payment id */
  CustomField1: string;

  errors: Error[] = [];

  constructor(config: EcpayConfig, data: any = {}) {
    _.extend(this, data);

    const configRequires = [
      'MerchantID',
      'MerchantName',
      'MerchantID',
      'ReturnURL',
      'HashKey',
      'HashIV'
    ];
    if (!config || !_.every(configRequires, key => !_.isEmpty(config[key]))) {
      this.errors.push(new Error(`Invalid Ecpay config data`));
    } else {
      this.config = config;
      _.defaults(this, {
        MerchantID: config.MerchantID,
        MerchantTradeNo: `${config.MerchantName}${
          config.MerchantID
        }${moment().unix()}`,
        MerchantTradeDate: moment().format('YYYY/MM/DD hh:mm:ss'),
        ReturnURL: config.ReturnURL
      });
    }
  }

  getErrors(): Error[] {
    return this.errors;
  }

  fromPayment(payment: Payment): this {
    const paymentRequires = ['id', 'amount', 'purchases'];
    if (
      !payment ||
      !_.every(paymentRequires, key => payment[key])
    ) {
      const errorMessage = `Invalid payment data for Ecpay order,\nrequird data fields are ${paymentRequires}, your payment data is ${JSON.stringify(payment)}`;
      this.errors.push(new Error(errorMessage));
    } else {
      this.TotalAmount = payment.amount;
      this.TradeDesc = payment.description || _.join(
        payment.purchases.map(purchase => `${purchase.product.name} X ${purchase.quantity}`),
        '\n');
      this.ItemName = _.join(
        payment.purchases.map(purchase => purchase.product.name),
        '#'
      );
      this.CustomField1 = payment.id;
    }
    return this;
  }

  toParams(): EcpayOrderParams {
    const params: any = _.pick(this, [
      'MerchantID',
      'MerchantTradeNo',
      'MerchantTradeDate',
      'PaymentType',
      'TotalAmount',
      'TradeDesc',
      'ItemName',
      'ReturnURL',
      'ChoosePayment',
      'EncryptType',
      'CustomField1'
    ]);
    params.CheckMacValue = this.encodeCheckMac(params);
    return params;
  }

  convertToDotNetEncoding(text: string): string {
    return text
      .replace(/%2d/g, '-')
      .replace(/%5f/g, '_')
      .replace(/%2e/g, '.')
      .replace(/%21/g, '!')
      .replace(/%2a/g, '*')
      .replace(/%28/g, '(')
      .replace(/%29/g, ')')
      .replace(/%20/g, '+');
  }

  encodeCheckMac(params: any): string {
    const _params = _.omit(params, 'CheckMacValue');
    let result = '';
    const tokens = [`HashKey=${this.config.HashKey}`];
    _.keys(_params)
      .sort()
      .forEach(key => {
        tokens.push(`${key}=${_params[key]}`);
      });
    tokens.push(`HashIV=${this.config.HashIV}`);
    // console.dir(tokens);
    result = tokens.join('&');
    result = encodeURIComponent(result);
    result = this.convertToDotNetEncoding(result);
    result = result.toLowerCase();
    // console.log(result);
    result = crypto
      .SHA256(result)
      .toString()
      .toUpperCase();
    // console.log(result);
    return result;
  }
}
