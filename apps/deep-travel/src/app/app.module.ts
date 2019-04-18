import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatToolbarModule, MatIconModule, MatButtonModule } from '@angular/material';

import { UserFrontEndFeatureModule } from "@ygg/apps/user/frontend";

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { routes } from './routes';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    UserFrontEndFeatureModule,
    RouterModule.forRoot(routes)
    // DataAccessModule,
    // BrowserAnimationsModule,
    // AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
