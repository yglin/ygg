import { Component, OnInit, OnDestroy } from '@angular/core';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import { Observable, Subject, Subscription } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { FormControl } from '@angular/forms';
import { OmniTypes, Location } from '@ygg/shared/omni-types/core';
import { ItemTransferCompleteInfo } from '@ygg/ourbox/core';

@Component({
  selector: 'ygg-item-transfer-complete',
  templateUrl: './item-transfer-complete.component.html',
  styleUrls: ['./item-transfer-complete.component.css']
})
export class ItemTransferCompleteComponent
  implements OnInit, OnDestroy, YggDialogContentComponent {
  item: TheThing;
  dialogData: any;
  dialogOutput$?: Subject<ItemTransferCompleteInfo> = new Subject();
  formControl = new FormControl();
  subscription: Subscription = new Subscription();
  OmniTypes = OmniTypes;

  constructor() {
    this.subscription.add(
      this.formControl.valueChanges.subscribe(value => {
        if (Location.isLocation(value)) {
          this.dialogOutput$.next({
            newLocation: value
          });
        }
      })
    );
  }

  ngOnInit(): void {
    if (this.dialogData) {
      this.item = this.dialogData.item;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
