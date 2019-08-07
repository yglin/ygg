export class PageObject {
  protected parentSelector: string;
  protected selector: string;
  protected readonly selectors: { [name: string]: string };

  constructor(parentSelector: string = '') {
    this.parentSelector = parentSelector;
  }

  getSelector(name?: string): string {
    let targetSelector = '';
    if (name && (name in this.selectors)) {
      targetSelector = this.selectors[name];
    }
    return `${this.parentSelector} ${this.selector} ${targetSelector}`.trim();
  }
}