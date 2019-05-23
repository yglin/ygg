import { Component, OnInit } from '@angular/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { DialogSampleContentComponent } from './sample-content/sample-content.component';

@Component({
  selector: 'ygg-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.css']
})
export class DialogsComponent implements OnInit {
  message: string;

  constructor(
    private YggDialog: YggDialogService
  ) { }

  ngOnInit() {
  }

  openYggDialog() {
    const dialogRef = this.YggDialog.open(DialogSampleContentComponent, {
      title: 'Sample Dialog',
      data: {
        message: this.message
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert(`You submitted ${result}`);
      } else {
        alert(`You closed the dialog`);
      }
    });
  }

}
