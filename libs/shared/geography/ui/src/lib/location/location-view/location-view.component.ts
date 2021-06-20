import { Component, OnInit, Input } from '@angular/core';
import { Located, Location } from '@ygg/shared/geography/core';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import { Observable } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.css']
})
export class LocationViewComponent
  implements OnInit, YggDialogContentComponent {
  @Input() location: Location;
  @Input() value: Location;
  dialogData: any;
  dialogOutput$?: Observable<any>;
  locationMarkers: Located[] = [];

  constructor() {}

  ngOnInit() {
    if (!this.location) {
      this.location = this.value;
    }
    if (this.dialogData && Location.isLocation(this.dialogData.location)) {
      this.location = this.dialogData.location;
    }

    if (Location.isLocation(this.location)) {
      this.locationMarkers = [{ location: this.location }];
    }
  }
}
