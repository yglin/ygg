import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThingImitation } from '@ygg/the-thing/core';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { Subscription } from 'rxjs';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { ImitationEditorComponent } from '../imitation-editor/imitation-editor.component';

@Component({
  selector: 'the-thing-imitation-manager',
  templateUrl: './imitation-manager.component.html',
  styleUrls: ['./imitation-manager.component.css']
})
export class ImitationManagerComponent implements OnInit, OnDestroy {
  imitations: TheThingImitation[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private imitationAccessService: TheThingImitationAccessService,
    private dialog: YggDialogService
  ) {
    this.subscriptions.push(
      this.imitationAccessService.list$().subscribe(
        imitations =>
          (this.imitations = imitations.sort((a, b) => {
            return a.createAt - b.createAt;
          }))
      )
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  addImitation() {
    this.dialog.open(ImitationEditorComponent, {
      title: '選取東東，新增為範本'
    });
  }
}
