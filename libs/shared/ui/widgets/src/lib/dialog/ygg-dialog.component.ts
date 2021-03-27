import {
  Component,
  ComponentFactoryResolver,
  Directive,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  YggDialogComponentData,
  YggDialogContentComponent
} from './ygg-dialog';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ygg-dialog-content-host]'
})
export class YggDialogContentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-ygg-dialog',
  templateUrl: './ygg-dialog.component.html',
  styleUrls: ['./ygg-dialog.component.css']
})
export class YggDialogComponent implements OnInit {
  @ViewChild(YggDialogContentHostDirective, { static: true })
  contentHost: YggDialogContentHostDirective;
  title: string;
  id: string | number;
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
            if (output.close && output.data) {
              this.output = output.data;
              this.confirmOutput();
            }
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
