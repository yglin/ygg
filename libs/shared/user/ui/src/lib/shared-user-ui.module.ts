import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { SharedInfraDataAccessModule } from '@ygg/shared/infra/data-access';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

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
import { UserSelectorComponent } from './components/user-selector/user-selector.component';
import { MailListControlComponent } from './components/mail-list/mail-list-control/mail-list-control.component';
import { routes } from './routes';
import { NotificationComponent } from './notification/notification/notification.component';
import { MyNotificationListComponent } from './notification/my-notification-list/my-notification-list.component';
import { UsersByEmailSelectorComponent } from './components/users-by-email-selector/users-by-email-selector.component';

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
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    AngularFireAuthModule,
    SharedInfraDataAccessModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    RouterModule.forChild(routes)
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
    UserViewComponent,
    UserSelectorComponent,
    MailListControlComponent,
    NotificationComponent,
    MyNotificationListComponent,
    UsersByEmailSelectorComponent
  ],
  entryComponents: [LoginDialogComponent],
  exports: [
    AccountWidgetComponent,
    UserThumbnailComponent,
    UserSelectorComponent,
    UsersByEmailSelectorComponent
  ]
})
export class SharedUserUiModule {}
