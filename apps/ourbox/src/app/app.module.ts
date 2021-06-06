import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { OurboxUiModule } from '@ygg/ourbox/ui';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedThreadUiModule } from '@ygg/shared/thread/ui';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { AppComponent } from './app.component';
// import { routes } from './route';
import { SharedUiNavigationModule } from '@ygg/shared/ui/navigation';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent
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
    SharedUiNavigationModule,
    SharedUiWidgetsModule,
    SharedUserUiModule,
    SharedOmniTypesUiModule,
    SharedThreadUiModule,
    BrowserAnimationsModule,
    OurboxUiModule,
    QuillModule.forRoot(),
    RouterModule.forRoot([])
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
