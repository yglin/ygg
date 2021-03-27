import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Box, BoxAgent } from '@ygg/ourbox/core';
import { wrapError } from '@ygg/shared/infra/error';
import {
  EmceeService,
  ImageThumbnailSelectorComponent,
  YggDialogService
} from '@ygg/shared/ui/widgets';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { HeadQuarterService } from '../head-quarter.service';
import { BoxFactoryService } from './box-factory.service';
import { BoxFinderService } from './box-finder.service';
import { GeographyAgentService } from '@ygg/shared/geography/ui';

@Injectable({
  providedIn: 'root'
})
export class BoxAgentService extends BoxAgent {
  constructor(
    emcee: EmceeService,
    auth: AuthenticateUiService,
    boxFactory: BoxFactoryService,
    boxFinder: BoxFinderService,
    headquarter: HeadQuarterService,
    router: Router,
    geographyAgent: GeographyAgentService,
    protected dialog: YggDialogService
  ) {
    super(
      emcee,
      auth,
      boxFactory,
      boxFinder,
      headquarter,
      router,
      geographyAgent
    );
  }

  async openMyBoxSelector(options: any = {}): Promise<Box[]> {
    try {
      const currentUser = await this.authenticator.requestLogin();
      const myBoxes = await this.boxFinder.findUserBoxes(currentUser);
      // console.dir(myBoxes);
      const dialogRef = this.dialog.open(ImageThumbnailSelectorComponent, {
        title: options.title,
        data: { items: myBoxes }
      });
      const selectedBox = await dialogRef.afterClosed().toPromise();
      return selectedBox;
    } catch (error) {
      const wrpError = wrapError(error, `Failed to select from my boxes`);
      return Promise.reject(wrpError);
    }
  }
}
