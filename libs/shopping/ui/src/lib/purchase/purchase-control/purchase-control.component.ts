import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Purchase } from '@ygg/shopping/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ygg-purchase-control',
  templateUrl: './purchase-control.component.html',
  styleUrls: ['./purchase-control.component.css']
})
export class PurchaseControlComponent implements OnInit {
  @Input() purchase: Purchase;
  @Output() submit: EventEmitter<Purchase> = new EventEmitter();
  displayedColumns = ['product', 'unitPrice', 'quantity', 'management'];
  purchasesDataSource: BehaviorSubject<Purchase[]> = new BehaviorSubject([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<PurchaseControlComponent>
  ) { }

  ngOnInit() {
    if (!this.purchase && this.dialogData && this.dialogData.purchase) {
      this.purchase = this.dialogData.purchase;
    }
    if (this.purchase) {
      this.purchase = this.purchase.clone();
    }
    if (this.purchase && this.purchase.children) {
      this.purchasesDataSource.next(this.purchase.children);
    }
  }

  onSubmit() {
    this.submit.emit(this.purchase);
    if (this.dialogRef) {
      this.dialogRef.close(this.purchase);
    }
  }

  removePurchase(index: number) {
    this.purchase.children.splice(index, 1);
    this.purchasesDataSource.next(this.purchase.children);
  }

  removeAll() {
    if (confirm('確定要移除所有其他購買項目？')) {
      this.purchase.children.length = 0;
      this.purchasesDataSource.next(this.purchase.children);
    }
  }
}
