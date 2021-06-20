import { Component, EventEmitter, Output } from '@angular/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { LocationViewComponent } from '../location-view/location-view.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-location-view-compact',
  templateUrl: './location-view-compact.component.html',
  styleUrls: ['./location-view-compact.component.css']
})
export class LocationViewCompactComponent extends LocationViewComponent {
  @Output() showMap: EventEmitter<any> = new EventEmitter();

  constructor(private dialog: YggDialogService) {
    super();
  }

  gotoMap() {
    this.dialog.open(LocationViewComponent, {
      title: this.location.address.getFullAddress(),
      data: { location: this.location }
    });
  }
}
