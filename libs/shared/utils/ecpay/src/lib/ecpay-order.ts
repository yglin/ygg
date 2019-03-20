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

  static convertToDotNetEncoding(text: string): string {
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

  static encodeCheckMac(params: any, hashKey: string, hashIV: string): string {
    const _params = _.omit(params, 'CheckMacValue');
    let result = '';
    const tokens = [`HashKey=${hashKey}`];
    _.keys(_params)
      .sort()
      .forEach(key => {
        tokens.push(`${key}=${_params[key]}`);
      });
    tokens.push(`HashIV=${hashIV}`);
    // console.dir(tokens);
    result = tokens.join('&');
    result = encodeURIComponent(result);
    result = EcpayOrder.convertToDotNetEncoding(result);
    result = result.toLowerCase();
    // console.log(result);
    result = crypto
      .SHA256(result)
      .toString()
      .toUpperCase();
    // console.log(result);
    return result;
  }

  constructor(config: EcpayConfig, data: any = {}) {
    _.extend(this, data);

    const configRequires = [
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
    // const params: any = _.pick(this, [
    //   'MerchantID',
    //   'MerchantTradeNo',
    //   'MerchantTradeDate',
    //   'PaymentType',
    //   'TotalAmount',
    //   'TradeDesc',
    //   'ItemName',
    //   'ReturnURL',
    //   'ChoosePayment',
    //   'EncryptType',
    //   'CustomField1'
    // ]);
    const params: any = {
      MerchantID: '2000132',
      TradeDesc: '促銷方案',
      PaymentType: 'aio',
      MerchantTradeDate: '2013/03/12 15:30:23',
      MerchantTradeNo: 'ecpay20130312153023',
      ReturnURL: 'https://www.ecpay.com.tw/receive.php',
      ItemName: 'Apple iphone 7 手機殼',
      TotalAmount: 1000,
      ChoosePayment: 'ALL',
      EncryptType: 1
    };
    params.CheckMacValue = EcpayOrder.encodeCheckMac(params, this.config.HashKey, this.config.HashIV);
    // params.CheckMacValue = EcpayOrder.encodeCheckMac(params, '5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS');
    return params;
  }

}
