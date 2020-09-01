import { Component, OnInit } from '@angular/core';
import { ImitationItemTransfer } from '@ygg/ourbox/core';
import { Observable } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { ItemTransferFactoryService } from '../item-transfer-factory.service';

@Component({
  selector: 'ourbox-my-item-transfers',
  templateUrl: './my-item-transfers.component.html',
  styleUrls: ['./my-item-transfers.component.css']
})
export class MyItemTransfersComponent implements OnInit {
  ImitationItemTransfer = ImitationItemTransfer;
  itemTransfers$: Observable<TheThing[]>;
  
  constructor(private itemTransferFactory: ItemTransferFactoryService) {
    this.itemTransfers$ = this.itemTransferFactory.listMyItemTransfers$;
  }

  ngOnInit(): void {
  }

}
