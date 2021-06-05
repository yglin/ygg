import { Component, OnInit } from '@angular/core';
import { EmceeService } from '@ygg/shared/ui/widgets';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-debugging',
  templateUrl: './debugging.component.html',
  styleUrls: ['./debugging.component.css']
})
export class DebuggingComponent implements OnInit {
  constructor(private emcee: EmceeService) {}

  ngOnInit(): void {}

  alertError() {
    this.emcee.error(`A fake error message for testing`);
  }
}
