import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import * as chroma from 'chroma-js';
import { Color } from 'chroma-js';
import { isEmpty } from 'lodash';

@Directive({
  selector: '[yggNgForColorBackground]'
})
export class NgForColorBackgroundDirective implements OnInit {
  @Input() index: number = 0;
  @Input() palette: Color[] = [];
  element: ElementRef;

  constructor(el: ElementRef) {
    this.element = el;
    this.element.nativeElement.style.padding = '3vw 3vh';
    this.element.nativeElement.style['border-radius'] = '1vw';
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (isEmpty(this.palette)) {
      this.palette = [chroma('#ffdb80'), chroma('#cdff85')];
    }
    const backgroundColor: Color = this.palette[
      this.index % this.palette.length
    ];
    const gradient = `linear-gradient(${backgroundColor
      .alpha(0)
      .css()}, ${backgroundColor
        .alpha(0.5)
        .css()} 20%, ${backgroundColor.alpha(0).css()})`;
    this.element.nativeElement.style.background = `url("/assets/images/img-noise-256x180.png"), ${gradient}`;
    // console.log(this.element.nativeElement.style.background);
  }
}
