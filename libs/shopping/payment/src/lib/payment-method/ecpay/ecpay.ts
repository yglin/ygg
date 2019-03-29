import { omit, keys, every, isEmpty, join, pick } from 'lodash';
import * as moment from 'moment';
import { SHA256 } from 'crypto-js';
import { Payment } from '@ygg/shared/interfaces';
import { PaymentMethodConfig } from '../payment-method';

export interface EcpayConfig extends PaymentMethodConfig {
  MerchantName: string;
  MerchantID: string;
  ReturnURL: string;
  HashKey: string;
  HashIV: string;
  [property: string]: any;
}

export enum EcpayChoosePayment {
  Credit = 'Credit',
  AndroidPay = 'AndroidPay',
  WebATM = 'WebATM',
  ATM = 'ATM',
  CVS = 'CVS',
  BARCODE = 'BARCODE',
  ALL = 'ALL'
}

export interface EcpayOrderParams {
  MerchantID: string;
  MerchantTradeNo: string;
  StoreID?: string;
  MerchantTradeDate: string;
  PaymentType: string;
  TotalAmount: number;
  TradeDesc: string;
  ItemName: string;
  ReturnURL: string;
  ChoosePayment: EcpayChoosePayment;
  CheckMacValue: string;
  ClientBackURL?: string;
  ItemURL?: string;
  Remark?: string;
  ChooseSubPayment?: string;
  OrderResultURL?: string;
  NeedExtraPaidInfo?: string;
  DeviceSource?: string;
  IgnorePayment?: string;
  PlatformID?: string;
  InvoiceMark?: string;
  CustomField1?: string;
  CustomField2?: string;
  CustomField3?: string;
  CustomField4?: string;
  EncryptType: number;
}

export class EcpayOrder implements EcpayOrderParams {
  config: EcpayConfig;

  _MerchantID: string;
  set MerchantID(value: string) {
    if (value.length <= 10) {
      this._MerchantID = value;
    } else {
      throw new Error('Length of MerchantID must <= 10');
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
      throw new Error('Length of MerchantTradeNo must <= 20');
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
      throw new Error('Length of TradeDesc must <= 200');
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
      throw new Error('Length of ItemName must <= 200');
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
      throw new Error('Length of ReturnURL must <= 200');
    }
  }

  get ReturnURL(): string {
    return this._ReturnURL;
  }

  ChoosePayment = EcpayChoosePayment.ALL;

  _CheckMacValue: string;
  set CheckMacValue(value: string) {
    if (value.length <= 200) {
      this._CheckMacValue = value;
    } else {
      throw new Error('Length of CheckMacValue must <= 200');
    }
  }

  get CheckMacValue(): string {
    return this._CheckMacValue;
  }

  EncryptType = 1;

  /** Store local payment id */
  CustomField1: string;

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
    const _params = omit(params, 'CheckMacValue');
    let result = '';
    const tokens = [`HashKey=${hashKey}`];
    keys(_params)
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
    result = SHA256(result)
      .toString()
      .toUpperCase();
    // console.log(result);
    return result;
  }

  constructor(config: EcpayConfig, payment: Payment) {
    const configRequires = [
      'MerchantName',
      'MerchantID',
      'ReturnURL',
      'HashKey',
      'HashIV'
    ];
    if (!config || !every(configRequires, key => !isEmpty(config[key]))) {
      throw new Error(`Invalid Ecpay config data`);
    }

    this.config = config;

    this.MerchantID = config.MerchantID;

    this.MerchantTradeNo = `${config.MerchantName}${
      config.MerchantID
    }${moment().unix()}`;

    this.MerchantTradeDate = moment().format('YYYY/MM/DD hh:mm:ss');

    this.ReturnURL = config.ReturnURL;

    const paymentRequires = ['id', 'amount', 'purchases'];
    if (!payment || !every(paymentRequires, key => payment[key])) {
      const errorMessage = `Invalid payment data for Ecpay order,\nrequird data fields are ${paymentRequires}, your payment data is ${JSON.stringify(
        payment
      )}`;
      throw new Error(errorMessage);
    }

    this.TotalAmount = payment.amount;
    this.ItemName = join(
      payment.purchases.map(
        purchase => `${purchase.product.name} X ${purchase.quantity}`
      ),
      '#'
    );

    this.TradeDesc = payment.description || this.ItemName;

    this.CustomField1 = payment.id;
  }

  toParams(): EcpayOrderParams {
    const params: any = pick(this, [
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

    // Trim illegal characters: newline
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        if (typeof value === 'string') {
          params[key] = value.replace(/\r?\n|\r/g, '');
        }
      }
    }

    params.CheckMacValue = EcpayOrder.encodeCheckMac(
      params,
      this.config.HashKey,
      this.config.HashIV
    );
    return params;
  }
}
