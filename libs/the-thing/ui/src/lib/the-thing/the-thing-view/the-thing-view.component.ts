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
import { ImitationService } from '../../imitation.service';

@Component({
  selector: 'the-thing-the-thing-view',
  templateUrl: './the-thing-view.component.html',
  styleUrls: ['./the-thing-view.component.css']
})
export class TheThingViewComponent implements OnInit, OnDestroy {
  @Input() theThing: TheThing;
  subscriptions: Subscription[] = [];
  isPendingRelation = false;

  imitation: TheThingImitation;
  useImitationView = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageStashService: PageStashService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private imitationService: ImitationService
  ) {}

  ngOnInit() {
    if (!this.theThing) {
      if (this.route.snapshot.data && this.route.snapshot.data.theThing) {
        this.theThing = this.route.snapshot.data.theThing;
      }
    }
    if (this.theThing && this.theThing.imitation) {
      this.imitation = this.imitationService.get(this.theThing.imitation);
      const component = get(this.imitation, 'view.component');
      this.useImitationView = !!component;
    }

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
    const urlCreate = `/the-things/create?clone=${this.theThing.id}`;
    this.router.navigateByUrl(urlCreate);
  }
}
