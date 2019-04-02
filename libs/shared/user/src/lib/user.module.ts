import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { SharedUiWidgetsModule } from '@ygg/shared/ui-widgets';
import { ContactFormComponent } from './contact/contact-form/contact-form.component';
import { ContactViewComponent } from './contact/contact-view/contact-view.component';
import { AccountWidgetComponent } from './ui/account-widget/account-widget.component';
import { LoginDialogComponent } from './ui/login-dialog/login-dialog.component';
import { UserThumbnailComponent } from './ui/user-thumbnail/user-thumbnail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularFireAuthModule,
    SharedUiWidgetsModule,

    RouterModule.forChild([
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
    ])
  ],
  declarations: [ContactFormComponent, ContactViewComponent, AccountWidgetComponent, LoginDialogComponent, UserThumbnailComponent],
  entryComponents: [
    LoginDialogComponent
  ],
  exports: [ContactFormComponent, ContactViewComponent, AccountWidgetComponent, UserThumbnailComponent]
})
export class UserModule {}
