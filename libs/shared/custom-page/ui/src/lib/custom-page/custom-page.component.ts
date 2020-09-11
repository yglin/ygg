import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomPage } from '@ygg/shared/custom-page/core';
import { Subscription } from 'rxjs';
import { CustomPageAccessService } from '../custom-page-access.service';
import { AuthorizeService } from '@ygg/shared/user/ui';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Html } from '@ygg/shared/omni-types/core';
import { CustomPageFactoryService } from '../custom-page-factory.service';

@Component({
  selector: 'ygg-custom-page',
  templateUrl: './custom-page.component.html',
  styleUrls: ['./custom-page.component.css']
})
export class CustomPageComponent implements OnInit, OnDestroy {
  @Input() id: string;
  customPage: CustomPage;
  subscription: Subscription = new Subscription();
  editable = false;
  isEditMode = false;
  tabIndex = 1;
  formGroup: FormGroup;

  constructor(
    private customPageAccessor: CustomPageAccessService,
    private customPageFactory: CustomPageFactoryService,
    private authorizer: AuthorizeService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      content: []
    });
    this.subscription.add(
      this.authorizer.isAdmin$().subscribe(isAdmin => (this.editable = isAdmin))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.customPage = new CustomPage({ id: this.id });
    if (this.id) {
      this.subscription.add(
        this.customPageAccessor.load$(this.id).subscribe(customPage => {
          if (customPage) {
            this.customPage = customPage;
          }
          this.formGroup
            .get('content')
            .setValue(this.customPage.content, { emitEvent: false });
        })
      );
    }
  }

  showEditor() {
    this.isEditMode = true;
    this.tabIndex = 0;
  }

  onTabChange(tabIndex: number) {
    // if (tabIndex === 1) {
    //   // console.log(this.formGroup.get('content').value);
    //   this.customPage.content = this.formGroup.get('content').value;
    // }
  }

  cancel() {
    this.formGroup
      .get('content')
      .setValue(this.customPage.content, { emitEvent: false });
    this.tabIndex = 1;
    this.isEditMode = false;
  }

  save() {
    this.customPage.content = this.formGroup.get('content').value;
    this.customPageFactory.save(this.customPage);
  }
}
