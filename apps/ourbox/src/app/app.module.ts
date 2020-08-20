import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { OurboxUiModule } from "@ygg/ourbox/ui";
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedThreadUiModule } from '@ygg/shared/thread/ui';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { TheThingUiModule } from '@ygg/the-thing/ui';
import { noop } from 'lodash';
import { AppComponent } from './app.component';
import { BoxFactoryService } from './box-factory.service';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { routes } from './route';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    // MapComponent,
    // BoxCreateComponent,
    // BoardComponent,
    // BoxViewComponent,
    // ItemViewComponent,
    // ItemThumbnailComponent,
    // MyBoxesComponent,
    // ItemTransferComponent,
    // ItemTransferCompleteComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserUiModule,
    SharedOmniTypesUiModule,
    SharedThreadUiModule,
    TheThingUiModule,
    BrowserAnimationsModule,
    OurboxUiModule,
    RouterModule.forRoot(routes)
  ],
  // providers: [
  //   {
  //     provide: APP_INITIALIZER,
  //     useFactory: initFactoryServices,
  //     deps: [BoxFactoryService],
  //     multi: true
  //   }
  // ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// export function initFactoryServices(boxFactory: BoxFactoryService) {
//   // Do nothing, just to call constructors of factories
//   return noop;
// }
