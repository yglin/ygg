import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Type
} from '@angular/core';

import { Directive } from '@angular/core';
import { TheThingImitationViewComponent } from '..';
import {
  TheThingImitation,
  TheThing,
  ITheThingEditorComponent
} from '@ygg/the-thing/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { first, switchMap, timeout, map, catchError } from 'rxjs/operators';
import { TheThingEditorComponent } from '../the-thing-editor/the-thing-editor.component';
import { TheThingFactoryService } from '../../the-thing-factory.service';
import { get } from 'lodash';
import { TheThingEditorService } from '../../the-thing-editor.service';
import { throwError, of } from 'rxjs';

@Directive({
  selector: '[the-thing-editor-host]'
})
export class TheThingEditorHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'the-thing-edit-page',
  templateUrl: './the-thing-edit-page.component.html',
  styleUrls: ['./the-thing-edit-page.component.css']
})
export class TheThingEditPageComponent implements OnInit {
  imitation$: Promise<TheThingImitation>;
  component$: Promise<Type<any>>;
  theThing$: Promise<TheThing>;
  @ViewChild(TheThingEditorHostDirective, { static: true })
  editorHost: TheThingEditorHostDirective;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imitationAccessService: TheThingImitationAccessService,
    private theThingFactory: TheThingFactoryService,
    private theThingEditorService: TheThingEditorService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    const imitationId = this.route.snapshot.queryParamMap.get('imitation');
    this.imitation$ = this.imitationAccessService
      .get$(imitationId)
      .pipe(
        first(),
        timeout(5000),
        catchError(error => {
          console.error(error.message);
          return of(null);
        })
      )
      .toPromise();

    this.component$ = this.imitation$
      .then(imitation => {
        if (imitation && imitation.editor) {
          return this.theThingEditorService.getComponent(imitation.editor);
        } else {
          throw new Error(`No imitation or its editor`);
        }
      })
      .catch(error => {
        console.error(error.message);
        return TheThingEditPageComponent;
      });

    this.theThing$ = this.imitation$.then(imitation => {
      const fromRouteId: TheThing = get(
        this.route.snapshot.data,
        'theThing',
        null
      );
      if (fromRouteId) {
        // from specified id in route path
        return fromRouteId;
      } else {
        // create a new one
        const options = !!imitation ? { imitation } : {};
        return this.theThingFactory.create(options);
      }
    });
  }

  ngOnInit() {
    Promise.all([this.component$, this.theThing$]).then(results => {
      const component = results[0];
      const theThing = results[1];
      this.loadEditorComponent(component, theThing);
    });
  }

  async loadEditorComponent(component: Type<any>, theThing: TheThing) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      component
    );

    const viewContainerRef = this.editorHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as ITheThingEditorComponent).theThing = theThing;
  }
}
