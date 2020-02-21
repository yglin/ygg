import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { isEmpty } from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import {
  TheThingImitationAccessService,
  TheThingAccessService
} from '@ygg/the-thing/data-access';
import { Observable, of, Subscription, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';

@Component({
  selector: 'the-thing-imitation-editor',
  templateUrl: './imitation-editor.component.html',
  styleUrls: ['./imitation-editor.component.css']
})
export class ImitationEditorComponent
  implements OnInit, OnDestroy, YggDialogContentComponent {
  formGroup: FormGroup;
  @Input() imitation: TheThingImitation;
  dialogData: any;
  dialogSubmit$: Subject<TheThingImitation> = new Subject();
  imitation$: Subject<TheThingImitation> = new Subject();
  selectedTemplate: TheThing;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private imitationAccessService: TheThingImitationAccessService,
    private theThingAccessService: TheThingAccessService
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: '',
      template: [null, Validators.required]
    });
    this.subscriptions.push(
      this.imitation$
        .pipe(
          tap(imitation => {
            this.formGroup.patchValue(imitation);
          }),
          // switchMap((imitation: TheThingImitation) => {
          //   return this.theThingAccessService.get$(imitation.templateId);
          // }),
          // tap((template: TheThing) => {
          //   const selected = [];
          //   if (template) {
          //     selected.push(template);
          //   }
          //   this.formGroup.get('template').setValue(selected);
          // })
        )
        .subscribe()
    );
    this.subscriptions.push(
      this.formGroup.get('template').valueChanges.subscribe(selected => {
        if (isEmpty(selected)) {
          this.selectedTemplate = null;
        } else {
          this.selectedTemplate = selected[0];
        }
      })
    );
  }

  ngOnInit() {
    if (this.imitation) {
      this.imitation$.next(this.imitation);
    } else {
      this.imitation = new TheThingImitation();
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onSelectTemplate(template: TheThing) {
    this.formGroup.get('template').setValue(template);
  }

  async onSubmit() {
    const name = this.formGroup.get('name').value;
    if (
      this.formGroup.valid &&
      this.selectedTemplate &&
      confirm(`確定要新增/修改範本 ${name} ?`)
    ) {
      this.imitation.fromJSON(this.formGroup.value);
      // this.imitation.setTemplate(this.selectedTemplate);
      try {
        await this.imitationAccessService.upsert(this.imitation);
        alert(`新增/修改範本 ${name} 成功`);
        this.dialogSubmit$.next(this.imitation);
      } catch (error) {
        alert(`新增/修改範本失敗，錯誤原因：${error.message}`);
      }
    }
  }
}
