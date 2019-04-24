// import {CommonModule} from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
// import { RouterModule } from '@angular/router';
import {SharedUiWidgetsModule} from '@ygg/shared/ui/widgets';
import {SharedUserModule} from '@ygg/shared/user';

import {AccountWidgetComponent} from './components/account-widget/account-widget.component';
import {LoginDialogComponent} from './components/login-dialog/login-dialog.component';
import {UserEmailComponent} from './components/user-email/user-email.component';
import {UserMenuComponent} from './components/user-menu/user-menu.component';
import {UserPhoneComponent} from './components/user-phone/user-phone.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserProviderLinkComponent} from './components/user-provider-link/user-provider-link.component';
import {UserStateComponent} from './components/user-state/user-state.component';
import {UserThumbnailComponent} from './components/user-thumbnail/user-thumbnail.component';
import {UserViewComponent} from './components/user-view/user-view.component';
import {routes} from './routes';

@NgModule({
  imports: [RouterModule, SharedUiWidgetsModule, SharedUserModule],
  declarations: [
    AccountWidgetComponent, LoginDialogComponent, UserThumbnailComponent,
    UserMenuComponent, UserProfileComponent, UserProviderLinkComponent,
    UserStateComponent, UserEmailComponent, UserPhoneComponent,
    UserViewComponent
  ],
  providers: [],
  entryComponents: [LoginDialogComponent],
  exports: [
    AccountWidgetComponent
  ]
})
export class UserFrontEndModule {
}

@NgModule({
  declarations: [],
  imports: [UserFrontEndModule, RouterModule.forChild(routes)],
  providers: [],
  exports: [UserFrontEndModule]
})
export class UserFrontEndFeatureModule {
}
