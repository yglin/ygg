import { Component, Input } from '@angular/core';

@Component({
  selector: 'agm-map',
  template: '',
  styles: ['']
})
export class MockAgmMapComponent {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() zoom: number;
}

@Component({
  selector: 'agm-marker',
  template: '',
  styles: ['']
})
export class MockAgmMarkerComponent {
  @Input() latitude: number;
  @Input() longitude: number;
}
