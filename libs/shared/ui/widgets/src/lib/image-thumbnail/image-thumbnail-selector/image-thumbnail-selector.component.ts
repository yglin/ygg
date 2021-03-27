import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';
import { ImageThumbnailItem } from '..';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { extend, remove, find, isEmpty } from 'lodash';
import { YggDialogContentComponent } from '../../dialog';
import { Subject } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-image-thumbnail-selector',
  templateUrl: './image-thumbnail-selector.component.html',
  styleUrls: ['./image-thumbnail-selector.component.css']
})
export class ImageThumbnailSelectorComponent
  implements OnInit, YggDialogContentComponent {
  @Input() items: ImageThumbnailItem[];
  @Input() multiSelect = false;
  @Input() selection: ImageThumbnailItem[] = [];
  @Input() canCreate = false;
  @Output() selectionChange: EventEmitter<
    ImageThumbnailItem[]
  > = new EventEmitter();
  dialogData: any;
  dialogOutput$: Subject<any> = new Subject();
  isDialog: boolean;

  constructor() {}

  ngOnInit() {
    this.isDialog = !!this.dialogData;
    this.multiSelect =
      this.multiSelect !== undefined && this.multiSelect !== false;
    if (this.dialogData) {
      this.items = isEmpty(this.dialogData.items) ? [] : this.dialogData.items;
      this.multiSelect = !!this.dialogData.multiSelect;
      this.canCreate = !!this.dialogData.canCreate;
    }
  }

  onSelectItem(item: ImageThumbnailItem) {
    if (find(this.selection, selected => selected.id === item.id)) {
      remove(this.selection, selected => selected.id === item.id);
    } else {
      if (!this.multiSelect) {
        this.selection.length = 0;
      }
      this.selection.push(item);
    }
    this.selectionChange.emit(this.selection);
    this.dialogOutput$.next(this.selection);
  }

  isEmptySelection(): boolean {
    return isEmpty(this.selection);
  }

  isSelected(item: ImageThumbnailItem): boolean {
    return (
      !isEmpty(this.selection) &&
      !!find(this.selection, selected => selected.id === item.id)
    );
  }

  onClickCreate() {
    this.dialogOutput$.next({ data: 'create', close: true });
  }

  // onSubmit() {
  //   let selection: any = this.selection;
  //   if (!this.multiSelect) {
  //     selection = isEmpty(this.selection) ? null : this.selection[0];
  //   }
  //   this.dialogOutput$.next(selection);
  // }
}
