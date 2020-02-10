import { Component, OnInit, Input } from '@angular/core';

const MAX_LEVEL = 10;
const MAX_FONT_SIZE = 24;
const MIN_FONT_SIZE = 12;

@Component({
  selector: 'ygg-title-divider',
  templateUrl: './title-divider.component.html',
  styleUrls: ['./title-divider.component.css']
})
export class TitleDividerComponent implements OnInit {
  @Input() level: number = 1;
  styles: any = {};
  maxFontSize: number = MAX_FONT_SIZE;
  minFontSize: number = MIN_FONT_SIZE;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.level = Math.min(this.level, MAX_LEVEL);
    const leveledFontSize = 
      MIN_FONT_SIZE +
      Math.floor(
        ((MAX_FONT_SIZE - MIN_FONT_SIZE) * (MAX_LEVEL - this.level + 1)) /
          MAX_LEVEL
      );
    this.minFontSize = Math.max(MIN_FONT_SIZE, leveledFontSize - 2);
    this.maxFontSize = Math.min(MAX_FONT_SIZE, leveledFontSize + 2);
    const width = (90 * (MAX_LEVEL - this.level + 1)) / MAX_LEVEL;
    this.styles = {
      width: width + '%',
      'min-width': '300px'
    };
    // console.dir(this.level);
    // console.dir(this.styles);
  }
}
