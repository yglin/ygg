export enum EcpayPaymentMethod {
  Credit = 'Credit',
  AndroidPay = 'AndroidPay',
  WebATM = 'WebATM',
  ATM = 'ATM',
  CVS = 'CVS',
  BARCODE = 'BARCODE',
  ALL = 'ALL'
}

export interface iEcpayConfig {
  MerchantName: string;
  MerchantID: string;
  ReturnURL: string;
  HashKey: string;
  HashIV: string;
  interfaceUrl: string;
}

export interface iEcpayOrder {
  MerchantID: string;
  MerchantTradeNo: string;
  StoreID?: string;
  MerchantTradeDate: string;
  PaymentType: string;
  TotalAmount: number;
  TradeDesc: string;
  ItemName: string;
  ReturnURL: string;
  ChoosePayment: EcpayPaymentMethod;
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

  toParams(): any;
}
