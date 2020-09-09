import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { YggDialogService } from '../../dialog';
import { EmceeService } from '../../emcee.service';

@Component({
  selector: 'ygg-extra-info-button',
  templateUrl: './extra-info-button.component.html',
  styleUrls: ['./extra-info-button.component.css']
})
export class ExtraInfoButtonComponent implements OnInit {
  @Input() extraInfo: string;

  constructor(private emcee: EmceeService) {}

  ngOnInit(): void {}

  showInfo() {
    this.emcee.info(this.extraInfo);
  }
}
