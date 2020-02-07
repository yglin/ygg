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
  selector: 'ygg-image-thumbnail-selector',
  templateUrl: './image-thumbnail-selector.component.html',
  styleUrls: ['./image-thumbnail-selector.component.css']
})
export class ImageThumbnailSelectorComponent
  implements OnInit, YggDialogContentComponent {
  @Input() items: ImageThumbnailItem[];
  @Input() singleSelect: boolean;
  @Input() selection: ImageThumbnailItem[] = [];
  isDialog: boolean;
  @Output() selectionChange: EventEmitter<
    ImageThumbnailItem[]
  > = new EventEmitter();
  dialogData: any;
  dialogSubmit$: Subject<
    ImageThumbnailItem[] | ImageThumbnailItem
  > = new Subject();

  constructor() {}

  ngOnInit() {
    if (this.dialogData) {
      extend(this, this.dialogData);
    }
    this.isDialog = !!this.dialogData;
    this.singleSelect =
      this.singleSelect !== undefined && this.singleSelect !== false;
    // console.log(this.dialogSubmit$.observers);
  }

  onSelectItem(item: ImageThumbnailItem) {
    if (find(this.selection, selected => selected.id === item.id)) {
      remove(this.selection, selected => selected.id === item.id);
    } else {
      if (this.singleSelect) {
        this.selection.length = 0;
      }
      this.selection.push(item);
    }
    this.selectionChange.emit(this.selection);
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

  onSubmit() {
    let selection: any = this.selection;
    if (this.singleSelect) {
      selection = isEmpty(this.selection) ? null : this.selection[0];
    }
    this.dialogSubmit$.next(selection);
  }
}
