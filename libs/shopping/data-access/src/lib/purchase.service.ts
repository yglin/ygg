import { Injectable } from '@angular/core';
import { Purchase, Product } from '@ygg/shopping/core';
import { LogService } from '@ygg/shared/infra/log';
import { ProductService } from './product.service';
import { take } from 'rxjs/operators';
import { Duration } from '@ygg/shared/types';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  constructor(
    private logService: LogService,
    private productService: ProductService
  ) {}

  async save(purchase: Purchase): Promise<any> {
    return Promise.resolve(purchase.toJSON());
  }

  async load(purchaseData: any): Promise<Purchase> {
    return Promise.resolve(
      new Purchase().fromJSON(purchaseData)
    );
  }
}
