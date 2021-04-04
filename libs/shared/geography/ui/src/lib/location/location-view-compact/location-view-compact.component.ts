import { Component, EventEmitter, Output } from '@angular/core';
import { LocationViewComponent } from '../location-view/location-view.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-location-view-compact',
  templateUrl: './location-view-compact.component.html',
  styleUrls: ['./location-view-compact.component.css']
})
export class LocationViewCompactComponent extends LocationViewComponent {
  @Output() showMap: EventEmitter<any> = new EventEmitter();

  gotoMap() {
    this.showMap.emit('true');
  }
}
