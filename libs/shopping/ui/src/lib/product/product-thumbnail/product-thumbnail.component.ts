import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Product, ProductType } from '@ygg/shopping/core';
import { ProductService } from '@ygg/shopping/data-access';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-product-thumbnail',
  templateUrl: './product-thumbnail.component.html',
  styleUrls: ['./product-thumbnail.component.css']
})
export class ProductThumbnailComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() type: ProductType;
  product: Product;
  subscriptions: Subscription[] = [];
  imgSrc: string;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    if (this.id && this.type) {
      this.subscriptions.push(
        this.productService
          .get$(this.type, this.id)
          .subscribe(product => {
            this.product = product;
            this.imgSrc = this.product && this.product.album && this.product.album.cover.src;
          })
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
