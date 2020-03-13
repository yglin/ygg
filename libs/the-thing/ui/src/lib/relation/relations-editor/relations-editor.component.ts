import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  forwardRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable, Subject, Subscription, merge, BehaviorSubject } from 'rxjs';
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';
import { isArray, noop, isEmpty, find } from 'lodash';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { tap, switchMap } from 'rxjs/operators';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { TheThingFinderComponent } from '../../the-thing/the-thing-finder/the-thing-finder.component';

@Component({
  selector: 'the-thing-relations-editor',
  templateUrl: './relations-editor.component.html',
  styleUrls: ['./relations-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RelationsEditorComponent),
      multi: true
    }
  ]
})
export class RelationsEditorComponent implements OnInit, ControlValueAccessor {
  @Input() name: string;
  @Input() subject: TheThing;
  @Output() createObject: EventEmitter<any> = new EventEmitter();
  objects$: Observable<TheThing[]>;
  selection: TheThing[] = [];
  relations: TheThingRelation[];
  relations$: BehaviorSubject<TheThingRelation[]> = new BehaviorSubject([]);
  subscriptions: Subscription[] = [];

  onChange: (value: TheThingRelation[]) => any = noop;
  onTouched: () => {};

  constructor(
    private theThingAccessService: TheThingAccessService,
    private dialog: YggDialogService
  ) {
    this.objects$ = this.relations$.pipe(
      // tap(relations => console.dir(relations)),
      switchMap(relations =>
        this.theThingAccessService.listByIds$(
          relations.map(relation => relation.objectId)
        )
      ),
      // tap(objects => console.dir(objects))
    );
  }

  ngOnInit(): void {}

  writeValue(value: any): void {
    // console.dir(JSON.stringify(obj));
    if (isArray(value)) {
      this.relations = value;
      // console.log('next relations');
      // console.dir(this.relations);
      this.relations$.next(this.relations);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  createRelationObject() {
    this.createObject.emit(this.name);
  }

  selectRelationObject() {
    const dialogRef = this.dialog.open(TheThingFinderComponent, {
      title: '從既有的物件中選取'
    });
    dialogRef.afterClosed().subscribe((objects: TheThing[]) => {
      if (!isEmpty(objects)) {
        for (const object of objects) {
          const relation = new TheThingRelation({
            name: this.name,
            subjectId: this.subject.id,
            objectId: object.id
          });
          this.relations.push(relation);
        }
        this.onChange(this.relations);
        this.relations$.next(this.relations);
      }
    });
  }

  onDeleteSelection() {
    if (!isEmpty(this.selection)) {
      const selectionNames = this.selection.map(s => s.name).join('\n');
      if (confirm(`確定要刪除以下物件的關聯？\n ${selectionNames}`)) {
        this.relations = this.relations.filter(
          relation => !!find(this.selection, s => s.id !== relation.objectId)
        );
        this.onChange(this.relations);
        this.relations$.next(this.relations);
        this.selection = [];
      }
    }
  }

  // onDeleteObject(object: TheThing) {
  //   if (confirm(`確定要取消與物件 ${object.name} 的關聯 ${this.name} ？`)) {
  //     this.relations = this.relations.filter(
  //       relation => relation.objectId !== object.id
  //     );
  //     this.onChange(this.relations);
  //     this.relations$.next(this.relations);
  //   }
  // }
}
