import * as _ from 'lodash';
import * as moment from 'moment';
import { EcpayPaymentMethod, iEcpayOrder, iEcpayConfig } from './ecpay';

export class EcpayOrder implements iEcpayOrder {
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

  constructor(data: any = {}) {
    _.extend(this, data);
    if (!this.MerchantTradeDate) {
      this.MerchantTradeDate = moment().format('YYYY/MM/DD hh:mm:ss');
    }
  }

  toParams(): any {
    const params = _.pick(this, [
      'MerchantID',
      'MerchantTradeNo',
      'MerchantTradeDate',
      'PaymentType',
      'TotalAmount',
      'TradeDesc',
      'ItemName',
      'ReturnURL',
      'ChoosePayment',
      'CheckMacValue',
      'EncryptType',
    ]);
    return params;
  }
}
