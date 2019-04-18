import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { DataAccessModule } from '@ygg/shared/data-access';
// import { SharedUiWidgetsModule } from '@ygg/shared/ui-widgets';
// import { ContactFormComponent } from './contact/contact-form/contact-form.component';
// import { ContactViewComponent } from './contact/contact-view/contact-view.component';
// import { AccountWidgetComponent } from './ui/account-widget/account-widget.component';
// import { LoginDialogComponent } from './ui/login-dialog/login-dialog.component';
// import { UserThumbnailComponent } from './ui/user-thumbnail/user-thumbnail.component';
// import { UserMenuComponent } from './ui/user-menu/user-menu.component';
// import { UserProfileComponent } from './ui/user-profile/user-profile.component';
// import { UserRoutingModule } from './user-routing.module';
// import { UserProviderLinkComponent } from './ui/user-provider-link/user-provider-link.component';
// import { UserStateComponent } from './ui/user-state/user-state.component';
// import { UserEmailComponent } from './ui/user-email/user-email.component';
// import { UserPhoneComponent } from './ui/user-phone/user-phone.component';
// import { UserViewComponent } from './ui/user-view/user-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularFireAuthModule,
    DataAccessModule
  ],
  declarations: [],
  exports: []
})
export class SharedUserModule {}
