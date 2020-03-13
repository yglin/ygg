import { Injectable } from '@angular/core';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import { AuthenticateService } from '@ygg/shared/user';
import { take, first } from 'rxjs/operators';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';

export interface ITheThingCreateOption {
  imitation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TheThingFactoryService {
  constructor(
    private authService: AuthenticateService,
    private imitationAccessServcie: TheThingImitationAccessService
  ) {}

  async create(options: any = {}): Promise<TheThing> {
    let newThing: TheThing;
    if (options.imitation) {
      const imitation = await this.imitationAccessServcie
        .get$(options.imitation)
        .pipe(first())
        .toPromise();
      newThing = imitation.createTheThing();
    } else {
      newThing = new TheThing();
    }

    if (this.authService.currentUser) {
      newThing.ownerId = this.authService.currentUser.id;
    }
    // console.log('Create the thing~!!');
    // console.dir(newThing.toJSON());
    return newThing;
  }
}
