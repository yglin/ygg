import { Directive, HostListener, Input, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { URL } from 'url';

@Directive({
  selector: '[yggIMaybeALink]'
})
export class IMaybeALinkDirective {
  url: URL;

  constructor(
    private element: ElementRef,
    protected renderer: Renderer2,
    protected router: Router
  ) { }

  @Input() set yggIMaybeALink(url: string) {
    if (url) {
      this.url = new URL(url);
      this.renderer.setStyle(this.element.nativeElement, 'cursor', 'pointer');
    } else {
      this.url = null;
      this.renderer.setStyle(this.element.nativeElement, 'cursor', 'auto');
    }
  }

  @HostListener('mouseenter') onmouseenter() {
    if (this.url) {
      window.status = this.url.toString();
    }
  }

  @HostListener('click') onClick() {
    if (this.url) {
      // console.log(`Redirect to ${this.url}`);
      if (this.url.protocol) {
        window.location.replace(this.url.toString());
      } else {
        this.router.navigateByUrl(this.url.toString());
      }
    }
  }
}
