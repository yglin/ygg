import { Injectable } from '@angular/core';
import { CustomPageFactory } from '@ygg/shared/custom-page/core';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { CustomPageAccessService } from './custom-page-access.service';

@Injectable({
  providedIn: 'root'
})
export class CustomPageFactoryService extends CustomPageFactory {
  constructor(
    customPageAccessor: CustomPageAccessService,
    emcee: EmceeService
  ) {
    super(customPageAccessor, emcee);
  }
}
