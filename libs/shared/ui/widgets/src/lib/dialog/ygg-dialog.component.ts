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
  @ViewChild(YggDialogContentHostDirective, { static: true })
  contentHost: YggDialogContentHostDirective;
  contentComponent: YggDialogContentComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: YggDialogComponentData,
    private dialogRef: MatDialogRef<YggDialogComponent>,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.title = 'Play What';
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
        if (this.contentComponent.dialogSubmit$) {
          this.contentComponent.dialogSubmit$
            .pipe(take(1))
            .subscribe(submitData => {
              this.dialogRef.close(submitData);
            });
        }
      }
      if (this.dialogData.title) {
        this.title = this.dialogData.title;
      }
    }
  }
}
