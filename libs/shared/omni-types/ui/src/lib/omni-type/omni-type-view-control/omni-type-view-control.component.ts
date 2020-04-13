import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OmniTypeID } from '@ygg/shared/omni-types/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { OmniTypeControlComponent } from '../omni-type-control/omni-type-control.component';

@Component({
  selector: 'ygg-omni-type-view-control',
  templateUrl: './omni-type-view-control.component.html',
  styleUrls: ['./omni-type-view-control.component.css']
})
export class OmniTypeViewControlComponent implements OnInit {
  @Input() type: OmniTypeID;
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Input() editable = false;

  constructor(private dialog: YggDialogService) {}

  ngOnInit(): void {}

  openControlDialog() {
    const dialogRef = this.dialog.open(OmniTypeControlComponent, {
      title: '編輯內容',
      data: {
        type: this.type,
        value: this.value
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (!!value) {
        this.value = value;
        this.valueChange.emit(value);
      }
    });
  }
}
