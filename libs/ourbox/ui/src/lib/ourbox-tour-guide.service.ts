import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OurboxTourGuide } from '@ygg/ourbox/core';
import { EmceeService } from '@ygg/shared/ui/widgets';

@Injectable({
  providedIn: 'root'
})
export class OurboxTourGuideService extends OurboxTourGuide {
  constructor(emcee: EmceeService, router: Router) {
    super(emcee, router);
  }
}
