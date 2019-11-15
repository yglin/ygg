import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable, throwError } from 'rxjs';
import { Product, ProductType } from '@ygg/shopping/core';
import { map } from 'rxjs/operators';
import { PlayService } from '@ygg/playwhat/play';
import { LogService } from '@ygg/shared/infra/log';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private playService: PlayService,
    private logService: LogService
  ) {}

  get$(type: ProductType, id: string): Observable<Product> {
    switch (type) {
      case ProductType.Play:
        return this.playService.get$(id);
      default:
        const error = new Error(`Unsupported product type ${type}`);
        this.logService.error(error.message);
        return throwError(error);
    }
  }
}
