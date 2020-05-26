import { Component, OnInit, Input } from '@angular/core';
import {
  TheThing,
  TheThingImitation,
  TheThingState
} from '@ygg/the-thing/core';
import { AuthorizeService, AuthenticateService } from '@ygg/shared/user/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { filter, tap, find, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { TheThingFactoryService } from '../../the-thing-factory.service';
import { isEmpty } from 'lodash';

@Component({
  selector: 'the-thing-state',
  templateUrl: './the-thing-state.component.html',
  styleUrls: ['./the-thing-state.component.css']
})
export class TheThingStateComponent implements OnInit {
  @Input() id: string;
  @Input() imitation: TheThingImitation;
  theThing: TheThing;
  currentState: TheThingState;
  enabledStates: string[] = [];

  constructor(
    private authenticateService: AuthenticateService,
    private authorizeService: AuthorizeService,
    private theThingFactory: TheThingFactoryService
  ) {}

  ngOnInit(): void {
    if (this.id && this.imitation) {
      const theThing$ = this.theThingFactory.load$(this.id).pipe(
        filter(thing => !!thing),
        tap(thing => {
          this.theThing = thing;
          this.currentState = this.imitation.getState(this.theThing);
        })
      );
      const user$ = this.authenticateService.currentUser$.pipe(
        filter(user => !!user)
      );
      const isAdmin$ = this.authorizeService.isAdmin$().pipe(startWith(false));
      combineLatest([theThing$, user$, isAdmin$])
        .pipe(
          tap(combined => {
            this.enabledStates = [];
            const [thing, user, isAdmin] = combined;
            const isOwner = !!user && !!thing && user.id === thing.ownerId;
            for (const name in this.imitation.states) {
              if (this.imitation.states.hasOwnProperty(name)) {
                const permissions = this.imitation.states[name].permissions;
                if (!isEmpty(permissions)) {
                  let allPassed = true;
                  checkPermissions: for (const permission of permissions) {
                    switch (permission) {
                      case 'isOwner':
                        if (!isOwner) {
                          console.warn(`State ${name} require owner`);
                          allPassed = false;
                          break checkPermissions;
                        }
                        break;

                      case 'isAdmin':
                        if (!isAdmin) {
                          console.warn(`State ${name} require admin`);
                          allPassed = false;
                          break checkPermissions;
                        }
                        break;

                      default:
                        if (
                          !!permission &&
                          this.currentState.name !== permission
                        ) {
                          console.warn(
                            `State ${name} require current state ${permission}`
                          );
                          allPassed = false;
                          break checkPermissions;
                        }
                        break;
                    }
                  }
                  if (allPassed) {
                    this.enabledStates.push(name);
                  }
                }
              }
            }
            console.log(this.enabledStates);
          })
        )
        .subscribe();
    }
  }

  canSetState(state: TheThingState): boolean {
    return this.enabledStates.indexOf(state.name) >= 0;
  }

  async setState(state: TheThingState) {
    this.theThingFactory.setState(this.theThing, this.imitation, state);
  }
}
