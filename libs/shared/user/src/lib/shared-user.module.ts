import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { SharedInfraDataAccessModule } from '@ygg/shared/infra/data-access';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from "@ygg/shared/ui/widgets";

import { AccountWidgetComponent } from './components/account-widget/account-widget.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { UserEmailComponent } from './components/user-email/user-email.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { UserPhoneComponent } from './components/user-phone/user-phone.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserProviderLinkComponent } from './components/user-provider-link/user-provider-link.component';
import { UserStateComponent } from './components/user-state/user-state.component';
import { UserThumbnailComponent } from './components/user-thumbnail/user-thumbnail.component';
import { UserViewComponent } from './components/user-view/user-view.component';

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
    RouterModule,
    FlexLayoutModule,
    AngularFireAuthModule,
    SharedInfraDataAccessModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule
  ],
  declarations: [
    AccountWidgetComponent,
    LoginDialogComponent,
    UserThumbnailComponent,
    UserMenuComponent,
    UserProfileComponent,
    UserProviderLinkComponent,
    UserStateComponent,
    UserEmailComponent,
    UserPhoneComponent,
    UserViewComponent
  ],
  entryComponents: [LoginDialogComponent],
  exports: [AccountWidgetComponent]
})
export class SharedUserModule {}
