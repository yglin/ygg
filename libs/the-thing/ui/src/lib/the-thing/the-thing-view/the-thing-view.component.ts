import { get } from 'lodash';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Directive,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Type,
  AfterViewInit
} from '@angular/core';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageStashService, PageData } from '@ygg/shared/infra/data-access';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { AuthenticateService } from '@ygg/shared/user';
import { TheThingViewsService } from '../../the-thing-views.service';

@Component({
  selector: 'the-thing-view',
  templateUrl: './the-thing-view.component.html',
  styleUrls: ['./the-thing-view.component.css']
})
export class TheThingViewComponent implements OnInit, OnDestroy {
  @Input() theThing: TheThing;
  @Input() readonly = false;
  isOwner = false;
  subscriptions: Subscription[] = [];
  isPendingRelation = false;

  theThingViewComponent: Type<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageStashService: PageStashService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private imitationService: TheThingImitationAccessService,
    private authenticateService: AuthenticateService,
    private theThingViewsService: TheThingViewsService
  ) {}

  ngOnInit() {
    this.readonly = this.readonly !== undefined && this.readonly !== false;

    if (!this.theThing) {
      if (this.route.snapshot.data && this.route.snapshot.data.theThing) {
        this.theThing = this.route.snapshot.data.theThing;
      }
      if (this.theThing.view) {
        this.theThingViewComponent = this.theThingViewsService.getComponent(
          this.theThing.view
        );
      }
    }

    this.subscriptions.push(
      this.authenticateService.currentUser$.subscribe(user => {
        if (
          user &&
          user.id &&
          this.theThing &&
          this.theThing.ownerId &&
          user.id === this.theThing.ownerId
        ) {
          this.isOwner = true;
        } else {
          this.isOwner = false;
        }
      })
    );

    const pageData = this.pageStashService.peepTop();
    this.isPendingRelation = !get(pageData, 'promises.relation.resolved', true);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  linkRelationBack() {
    const pageData = this.pageStashService.pop();
    if (pageData.promises && pageData.promises.relation) {
      pageData.promises.relation.resolved = true;
      pageData.promises.relation.data = {
        name: pageData.promises.relation.data,
        objectId: this.theThing.id
      };
    }
    this.pageStashService.push(pageData);
    this.router.navigateByUrl(pageData.path);
  }

  createClone() {
    this.router.navigate(['/', 'the-things', this.theThing.id, 'clone']);
  }

  gotoEdit() {
    this.router.navigate(['/', 'the-things', this.theThing.id, 'edit']);
  }
}
