import { get } from 'lodash';
import {
  Component,
  OnInit,
  Input,
  Directive,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Type
} from '@angular/core';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import { Observable } from 'rxjs';
import { TheThingImitationViewInterface } from './imitation-view-interface.component';

@Directive({
  selector: '[the-thing-imitation-view-host]'
})
export class ImitationViewHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'the-thing-imitation-view',
  templateUrl: './the-thing-imitation-view.component.html',
  styleUrls: ['./the-thing-imitation-view.component.css']
})
export class TheThingImitationViewComponent implements OnInit {
  @Input() component: Type<any>;
  @Input() theThing$: Observable<TheThing>;
  @ViewChild(ImitationViewHostDirective, { static: true })
  imitationViewHost: ImitationViewHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    if (this.component) {
      this.loadImitationComponent(this.component);
    }
  }

  loadImitationComponent(component: Type<TheThingImitationViewInterface>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      component
    );

    const viewContainerRef = this.imitationViewHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as TheThingImitationViewInterface).theThing$ = this.theThing$;
  }
}
