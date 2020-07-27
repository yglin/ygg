import { ComponentType } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Directive,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  Type
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  YggDialogComponentData,
  YggDialogContentComponent
} from './ygg-dialog';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[ygg-dialog-content-host]'
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
  id: string | number;
  @ViewChild(YggDialogContentHostDirective, { static: true })
  contentHost: YggDialogContentHostDirective;
  contentComponent: YggDialogContentComponent;
  hasOutput = false;
  hasOutputValue = false;
  output: any;
  isActive = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: YggDialogComponentData,
    private dialogRef: MatDialogRef<YggDialogComponent>,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    // this.title = 'Play What';
  }

  ngOnInit() {
    if (this.dialogData) {
      if (this.dialogData.contentComponent) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          this.dialogData.contentComponent
        );
        const viewContainerRef = this.contentHost.viewContainerRef;
        viewContainerRef.clear();
        const contentComponentRef = viewContainerRef.createComponent(
          componentFactory
        );
        this.contentComponent = contentComponentRef.instance as YggDialogContentComponent;
        this.contentComponent.dialogData = this.dialogData.data;
        if (this.contentComponent.dialogOutput$) {
          this.hasOutput = true;
          this.contentComponent.dialogOutput$.subscribe(output => {
            this.hasOutputValue = true;
            this.output = output;
          });
        }
      }
      if (this.dialogData.title) {
        this.title = this.dialogData.title;
      }
    }
  }

  confirmOutput() {
    this.dialogRef.close(this.output);
    this.isActive = false;
  }

  cancel() {
    this.dialogRef.close();
    this.isActive = false;
  }
}
