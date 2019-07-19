import {ComponentType} from '@angular/cdk/portal';
import {AfterViewInit, Component, ComponentFactoryResolver, Directive, Inject, OnInit, TemplateRef, ViewChild, ViewContainerRef, Type} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface YggDialogComponentData {
  contentComponent: Type<any>;
  title?: string;
  data?: any;
}

@Directive({
  selector: '[ygg-dialog-content-host]',
})
export class YggDialogContentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'ygg-ygg-dialog',
  templateUrl: './ygg-dialog.component.html',
  styleUrls: ['./ygg-dialog.component.css']
})
export class YggDialogComponent implements OnInit {
  title: string;
  @ViewChild(YggDialogContentHostDirective, { static: false }) contentHost: YggDialogContentHostDirective;

  constructor(
      @Inject(MAT_DIALOG_DATA) private dialogData: YggDialogComponentData,
      private componentFactoryResolver: ComponentFactoryResolver) {
        this.title = 'Play What';
      }

  ngOnInit() {
    if (this.dialogData && this.dialogData.contentComponent) {
      if (this.dialogData.contentComponent) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dialogData.contentComponent);
        const viewContainerRef = this.contentHost.viewContainerRef;
        viewContainerRef.clear();
        const contentComponentRef = viewContainerRef.createComponent(componentFactory);
        contentComponentRef.instance.dialogData = this.dialogData.data;
      }
      if (this.dialogData.title) {
        this.title = this.dialogData.title;
      }
    }
  }
}
