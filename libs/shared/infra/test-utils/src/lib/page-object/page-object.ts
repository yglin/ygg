export interface SelectorsConfig {
  main: string;
  [elementName: string]: string;
}

export abstract class PageObject {
  parentSelector: string = '';
  selectors: SelectorsConfig;

  constructor(parentSelector: string = '', selectorsConfig: SelectorsConfig = { main: '' }) {
    this.parentSelector = parentSelector;
    this.selectors = selectorsConfig;
  }

  getSelector(nameOrSelector?: string): string {
    const rootSelector = `${this.parentSelector} ${this.selectors.main}`.trim();
    if (!nameOrSelector) {
      // console.log(`Return root selector: ${rootSelector}`);
      return rootSelector;
    }
    if (this.selectors.hasOwnProperty(nameOrSelector)) {
      // It's a ui name predefined in selectors
      // console.log(`Found selector "${this.selectors[nameOrSelector]}" by element name ${nameOrSelector}`);
      return `${rootSelector} ${this.selectors[nameOrSelector]}`.trim();
    } else {
      // It's a raw selector string
      // console.log(`This seems a raw selector: ${nameOrSelector}`);
      return `${nameOrSelector}`.trim();
    }
  }
}

export abstract class ControlPageObject<T> extends PageObject {
  abstract async setValue(value: T);
}

export abstract class ViewPageObject<T> extends PageObject {
  abstract async expectValue(value: T);
}
