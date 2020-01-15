import { Component, OnInit } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'the-thing-the-thing-finder-dialog',
  templateUrl: './the-thing-finder-dialog.component.html',
  styleUrls: ['./the-thing-finder-dialog.component.css']
})
export class TheThingFinderDialogComponent implements OnInit {
  selection: TheThing[] = [];

  constructor(private dialogRef: MatDialogRef<TheThingFinderDialogComponent>) { }

  ngOnInit() {
  }

  onSelectChange(theThings: TheThing[]) {
    this.selection = theThings;
  }

  onSubmit() {
    this.dialogRef.close(this.selection);
  }
}
